import os
import json
import logging
import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import unquote
from io import BytesIO
from PIL import Image

# Константы
UPLOAD_DIR = "/images"
LOG_FILE = "/logs/app.log"
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 МБ
ALLOWED_EXTENSIONS = (".jpg", ".jpeg", ".png", ".gif")

# Единый словарь для MIME-типов
CONTENT_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".css": "text/css",
    ".js": "application/javascript",
    ".html": "text/html",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml",
    ".webp": "image/webp"
}

# Создание необходимых директорий
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs("/logs", exist_ok=True)

# Настройка логирования
logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="[%(asctime)s] %(levelname)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)


def log_success(message: str) -> None:
    """Логирует успешное выполнение операции."""
    logging.info(f"Success: {message}")


def log_error(message: str) -> None:
    """Логирует ошибку при выполнении операции."""
    logging.error(f"Error: {message}")


class ImageServer(BaseHTTPRequestHandler):
    """HTTP сервер для обработки загрузки и обслуживания изображений."""

    protocol_version = 'HTTP/1.1'

    def _set_cors_headers(self) -> None:
        """Устанавливает CORS заголовки для поддержки кросс-доменных запросов."""
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _send_response(self, code: int, content_type: str, content: bytes,
                       extra_headers: dict = None) -> None:
        """Универсальный метод для отправки HTTP ответов."""
        self.send_response(code)
        self.send_header("Content-type", content_type)
        self.send_header("Content-Length", str(len(content)))
        self._set_cors_headers()

        if extra_headers:
            for key, value in extra_headers.items():
                self.send_header(key, value)

        self.end_headers()
        self.wfile.write(content)

    def do_OPTIONS(self) -> None:
        """Обрабатывает OPTIONS запросы для CORS предварительных проверок."""
        self.send_response(200)
        self._set_cors_headers()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:
        """Обрабатывает GET запросы для обслуживания статических файлов и изображений."""
        path = unquote(self.path)

        if path == "/" or path == "/index.html":
            self._serve_static_file("/static/index.html", "text/html; charset=utf-8")
        elif path == "/favicon.ico":
            self._serve_static_file("/static/favicon.ico", "image/x-icon")
        elif path.startswith("/images/"):
            self._serve_uploaded_image(path)
        elif path.startswith(("/style.css", "/script.js", "/static/")):
            self._serve_static_file(path)
        else:
            self.send_error(404, "Page not found")

    def _serve_static_file(self, path: str, content_type: str = None) -> None:
        """Обслуживает статические файлы из директории /static."""
        try:
            # Нормализация пути для статических файлов
            if path.startswith("/static/"):
                filename = path[8:]  # remove "/static/" prefix
            else:
                filename = path[1:]  # remove leading "/"

            filepath = os.path.join("/static", filename)

            if os.path.isfile(filepath):
                with open(filepath, "rb") as f:
                    content = f.read()

                # Автоматическое определение MIME-типа если не указан
                if not content_type:
                    ext = os.path.splitext(filename)[1].lower()
                    content_type = CONTENT_TYPES.get(ext, "application/octet-stream")

                self._send_response(200, content_type, content)
            else:
                self.send_error(404, "File not found")

        except Exception as e:
            self.send_error(500, f"Server error: {e}")

    def _serve_uploaded_image(self, path: str) -> None:
        """Обслуживает загруженные пользователем изображения."""
        filename = os.path.basename(path)
        filepath = os.path.join(UPLOAD_DIR, filename)

        # Защита от path traversal атак
        filepath = os.path.abspath(filepath)
        if not filepath.startswith(os.path.abspath(UPLOAD_DIR)):
            self.send_error(403, "Access denied")
            return

        if os.path.isfile(filepath):
            try:
                with open(filepath, "rb") as f:
                    content = f.read()

                ext = os.path.splitext(filename)[1].lower()
                content_type = CONTENT_TYPES.get(ext, "application/octet-stream")

                self._send_response(200, content_type, content)
            except Exception as e:
                self.send_error(500, f"Server error: {e}")
        else:
            self.send_error(404, "Image not found")

    def do_POST(self) -> None:
        """Обрабатывает POST запросы для загрузки изображений на endpoint /upload."""
        if self.path != "/upload":
            self.send_error(404, "Route not found")
            return

        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            self.send_error(400, "Invalid content type. Expected multipart/form-data")
            return

        try:
            # Извлекаем boundary для парсинга multipart данных
            import re
            match = re.search(r'boundary=([^;]+)', content_type)
            if not match:
                self.send_error(400, "Could not find boundary in Content-Type")
                return

            boundary_token = match.group(1).strip()
            boundary = f"--{boundary_token}".encode('utf-8')

            content_length = int(self.headers.get("Content-Length", 0))
            if content_length == 0:
                self.send_error(400, "Empty request body")
                return

            # Чтение и парсинг тела запроса
            body = self.rfile.read(content_length)
            file_data, filename = self._parse_multipart_data(body, boundary)

            if not file_data or not filename:
                self.send_error(400, "No file was uploaded or file field is missing")
                return

            # Валидация загружаемого файла
            self._validate_uploaded_file(file_data, filename)

            # Сохранение файла с уникальным именем
            unique_name = self._save_uploaded_file(file_data, filename)

            # Отправка успешного ответа
            response_data = json.dumps({
                "status": "success",
                "message": "File uploaded successfully",
                "url": f"/images/{unique_name}"
            }).encode("utf-8")

            self._send_response(200, "application/json", response_data)

        except Exception as e:
            log_error(f"Unexpected error during file upload: {str(e)}")
            self.send_error(500, "Internal server error during file processing")

    def _parse_multipart_data(self, body: bytes, boundary: bytes) -> tuple:
        """Парсит multipart данные и извлекает файл."""
        parts = body.split(boundary)
        file_data = None
        filename = None

        for part in parts:
            if not part or part.strip() == b'--':
                continue

            # Поиск разделителя заголовков и данных
            header_end = part.find(b'\r\n\r\n')
            if header_end == -1:
                header_end = part.find(b'\n\n')
                if header_end == -1:
                    continue
                headers_part = part[:header_end]
                data_part = part[header_end + 2:]
            else:
                headers_part = part[:header_end]
                data_part = part[header_end + 4:]

            try:
                headers_text = headers_part.decode('utf-8', errors='ignore')
            except UnicodeDecodeError:
                continue

            # Поиск файла в multipart данных
            if 'name="file"' in headers_text and 'filename="' in headers_text:
                import re
                filename_match = re.search(r'filename="([^"]+)"', headers_text)
                if filename_match:
                    filename = filename_match.group(1)
                file_data = data_part.rstrip(b'\r\n')
                break

        return file_data, filename

    def _validate_uploaded_file(self, file_data: bytes, filename: str) -> None:
        """Выполняет валидацию загружаемого файла."""
        # Проверка расширения файла
        ext = os.path.splitext(filename)[1].lower()
        if ext not in ALLOWED_EXTENSIONS:
            log_error(f"Unsupported file format: {filename}")
            self.send_error(400, f"Unsupported file format. Allowed: {', '.join(ALLOWED_EXTENSIONS)}")

        # Проверка размера файла
        if len(file_data) > MAX_FILE_SIZE:
            log_error(f"File too large: {filename} ({len(file_data)} bytes)")
            self.send_error(400, f"File too large. Maximum size is {MAX_FILE_SIZE} bytes")

        # Проверка валидности изображения
        try:
            with Image.open(BytesIO(file_data)) as img:
                img.verify()
        except Exception as e:
            log_error(f"Invalid image file: {filename} - {str(e)}")
            self.send_error(400, "Invalid image file")

    def _save_uploaded_file(self, file_data: bytes, filename: str) -> str:
        """Сохраняет загруженный файл с уникальным именем."""
        ext = os.path.splitext(filename)[1].lower()
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
        unique_name = f"{timestamp}{ext}"
        filepath = os.path.join(UPLOAD_DIR, unique_name)

        with open(filepath, "wb") as f:
            f.write(file_data)

        log_success(f"Image uploaded successfully: {unique_name} (original: {filename})")
        return unique_name

    def send_error(self, code: int, message: str) -> None:
        """Переопределенный метод отправки ошибок в JSON формате."""
        error_json = json.dumps({"status": "error", "message": message}).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-type", "application/json")
        self.send_header("Content-Length", str(len(error_json)))
        self._set_cors_headers()
        self.end_headers()
        self.wfile.write(error_json)


if __name__ == "__main__":
    """Точка входа для запуска HTTP сервера."""
    server_address = ("0.0.0.0", 8000)
    print(f"Starting server on {server_address[0]}:{server_address[1]}")
    print("Server is running and waiting for connections...")

    httpd = HTTPServer(server_address, ImageServer)
    print("Server started on port 8000...")
    httpd.serve_forever()