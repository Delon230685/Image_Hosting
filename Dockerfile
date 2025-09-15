FROM python:3.13-slim

# Установка Pillow
RUN pip install --no-cache-dir pillow

# Создание директорий
RUN mkdir -p /images /logs /static

WORKDIR /app
COPY app.py /app/
COPY static/ /static/

EXPOSE 8000

CMD ["python", "app.py"]
