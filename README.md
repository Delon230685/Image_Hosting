# 🖼️ Image Hosting Service

[![Python 3.13](https://img.shields.io/badge/python-3.13-blue.svg)](https://www.python.org/downloads/release/python-312/)
[![Docker](https://img.shields.io/badge/docker-✓-blue.svg)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/nginx-✓-brightgreen.svg)](https://nginx.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

Сервис для хранения и обмена изображениями с простым веб-интерфейсом и API. Пользователи могут загружать изображения и получать прямые ссылки для分享 в соцсетях, блогах или мессенджерах.

## ✨ Возможности

- **Загрузка изображений** через веб-интерфейс или API
- **Поддержка форматов**: JPG, JPG, PNG, GIF
- **Автоматическая генерация** уникальных имен файлов
- **Прямые ссылки** на изображения
- **Логирование** всех операций
- **Docker-контейнеризация** для простого развертывания
- **Nginx** для быстрой раздачи статических файлов

## 🛠️ Технологии

[![Pillow](https://img.shields.io/badge/Pillow-10.0-lightgrey.svg)](https://python-pillow.org/)
[![Uvicorn](https://img.shields.io/badge/uvicorn-0.24-ff69b4.svg)](https://www.uvicorn.org/)
[![Docker Compose](https://img.shields.io/badge/docker--compose-2.0-blue.svg)](https://docs.docker.com/compose/)
[![Alpine Linux](https://img.shields.io/badge/alpine-3.18-0d597f.svg)](https://alpinelinux.org/)

- **Backend**: Python 3.13
- **Web Server**: Nginx
- **Контейнеризация**: Docker + Docker Compose
- **Хранение данных**: Docker Volumes
- **Обработка изображений**: Pillow

## 📦 Установка и запуск

### Предварительные требования

[![Docker 20.10+](https://img.shields.io/badge/docker-20.10%2B-2496ED.svg)](https://docs.docker.com/engine/install/)
[![Docker Compose 2.0+](https://img.shields.io/badge/docker--compose-2.0%2B-2496ED.svg)](https://docs.docker.com/compose/install/)

- Docker Engine 20.10+
- Docker Compose 2.0+

### Быстрый старт

1. Клонируйте репозиторий:
2. ```bash
git clone <repository-url>
cd image-hosting
Запустите сервис:

bash
docker-compose up --build
Откройте в браузере:

text
http://localhost:8080

🚀 Использование
Через веб-интерфейс
Перейдите на главную страницу http://localhost:8080

Нажмите "Выберите файл" и выберите изображение

Нажмите "Загрузить"

Скопируйте ссылку на изображение из результата

Через API
Загрузка изображения:

bash
curl -X POST -F "file=@your-image.jpg" http://localhost:8080/upload
Ответ:

json
{
  "message": "Файл загружен успешно",
  "filename": "a1b2c3d4e5.jpg", 
  "url": "/images/a1b2c3d4e5.jpg"
}
Просмотр изображения:

text
http://localhost:8080/images/a1b2c3d4e5.jpg
📁 Структура проекта
text
```
image-hosting/
├── app/                 # Основной файл Python
├── image/               # Папка для хранения загруженных картинок пользователем
├── logs/                # Папка для хранения логов
├── static/              # Папка для хранения статических файлов
│   └── assets           # Папка для хранения дополнительных статических ресурсов
│       ├── image/       # Папка с файлами для фона
│       ├── index.html   # Главная HTML-страница веб-приложения
│       ├── script.js    # Подключение JavaScript
│       └── style.css    # Подключение стилей CSS
├── requirements.txt     # Зависимости Python
├── Dockerfile           # Конфигурация образа приложения
├── docker-compose.yml   # Docker Compose конфигурация
├── nginx.conf           # Конфигурация Nginx
├── nginx/               # Папка для статистики
│   └── conf.d           # Дополнительная конфигурация
│       └── default.conf # Прямое обслуживание статических файлов
└── README.md            # Документация
```
⚙️ Конфигурация
Переменные окружения (.env)
ini
# Порт приложения
APP_PORT=8000

# Порт Nginx
NGINX_PORT=8080

# Лимит размера файла (в байтах)
MAX_FILE_SIZE=5242880
Поддерживаемые форматы
https://img.shields.io/badge/JPG-%25E2%259C%2593-yellow.svg
https://img.shields.io/badge/PNG-%25E2%259C%2593-blue.svg
https://img.shields.io/badge/GIF-%25E2%259C%2593-lightgrey.svg

JPEG/JPG (.jpg, .jpeg)

PNG (.png)

GIF (.gif)

Ограничения
https://img.shields.io/badge/max--size-5MB-red.svg

Максимальный размер файла: 5 MB

Автоматическое определение MIME-типа

Проверка расширения файла

🔧 API Endpoints
GET /
Главная страница с веб-интерфейсом

POST /upload
Загрузка изображения

Параметры:

file: файл изображения (multipart/form-data)

Ответ:

200: Успешная загрузка

400: Неподдерживаемый формат или превышен размер

500: Внутренняя ошибка сервера

GET /images/{filename}
Получение изображения (обслуживается Nginx)

📊 Логирование
Сервис ведет детальное логирование всех операций:

text
[2024-01-24 14:00:00] INFO: Изображение a1b2c3d4e5.jpg загружено успешно
[2024-01-24 14:01:00] ERROR: Неподдерживаемый формат: application/pdf
[2024-01-24 14:02:00] ERROR: Файл слишком большой: 6291456 bytes
Логи сохраняются в директории /logs и сохраняются между перезапусками.

🐳 Docker контейнеры
https://img.shields.io/badge/docker-build-2496ED.svg
https://img.shields.io/badge/docker--compose-deploy-2496ED.svg

Сервис состоит из двух контейнеров:

app
Порт: 8000 (внутренний)

Volume: /images, /logs

nginx
Веб-сервер для статических файлов

Порт: 8080 (внешний)

Volume: /images

🛡️ Безопасность
https://img.shields.io/badge/security-%25E2%259C%2593-green.svg

Валидация MIME-типов файлов

Проверка расширений файлов

Ограничение размера загружаемых файлов

Nginx настроен для безопасной раздачи статических файлов

Автоматическая генерация имен файлов предотвращает перезапись

📈 Производительность
https://img.shields.io/badge/performance-%25E2%259A%25A1-success.svg

Nginx обеспечивает высокоскоростную раздачу статических файлов

Оптимизированные Docker образы на основе Alpine Linux

🚦 Мониторинг
Для мониторинга работы сервиса используйте:

bash
# Просмотр логов приложения
docker-compose logs app

# Просмотр логов Nginx
docker-compose logs nginx

# Статус контейнеров
docker-compose ps
🔄 Развертывание в production
Настройте reverse proxy (nginx/caddy)

Включите HTTPS с помощью Let's Encrypt

Настройте мониторинг и алертинг

Регулярно обновляйте базовые образы Docker

🤝 Разработка
Локальная разработка
bash
# Установите зависимости
pip install -r app/requirements.txt

# Запустите приложение локально
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
Тестирование
bash
# Тест загрузки файла
curl -X POST -F "file=@test.jpg" http://localhost:8000/upload

# Тест списка изображений
curl http://localhost:8000/images/
📝 Лицензия
https://img.shields.io/badge/license-MIT-blue.svg

MIT License - смотрите файл LICENSE для подробностей.

🆘 Поддержка
Если у вас возникли проблемы:

Проверьте логи: docker-compose logs

Убедитесь, что порты 8080 и 8000 свободны

Проверьте наличие прав на запись в volumes

Приятного использования! 🎉