FROM python:3.11-slim

# Установка системных зависимостей для psycopg2
RUN apt-get update && apt-get install -y \
    libpq5 \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Создаем директории
RUN mkdir -p /app/image /app/logs /app/static /app/backups

# Копируем файлы
COPY app.py .
COPY logger_config.py .
COPY requirements.txt .
COPY static/ /app/static/

# Устанавливаем зависимости ВНУТРИ контейнера
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

CMD ["python", "app.py"]