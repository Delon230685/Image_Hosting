FROM python:3.13-slim

# Установка системных зависимостей для Pillow
RUN apt-get update && apt-get install -y \
    libjpeg-dev \
    zlib1g-dev \
    && rm -rf /var/lib/apt/lists/*

# Установка Python зависимостей
RUN pip install --no-cache-dir pillow

# Создание директорий
RUN mkdir -p /images /logs /static

WORKDIR /app
COPY app.py /app/
COPY static/ /static/

EXPOSE 8000

CMD ["python", "app.py"]