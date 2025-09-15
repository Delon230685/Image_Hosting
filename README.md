# 🖼️ Image Hosting Service

[![Python 3.13](https://img.shields.io/badge/python-3.13-blue.svg)](https://www.python.org/downloads/release/python-312/)
[![Docker](https://img.shields.io/badge/docker-✓-blue.svg)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/nginx-✓-brightgreen.svg)](https://nginx.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

Сервис для хранения и обмена изображениями с простым веб-интерфейсом и API. Пользователи могут загружать изображения и получать прямые ссылки для использования в соцсетях, блогах или мессенджерах.

## ✨ Возможности

- **Загрузка изображений** через веб-интерфейс или API
- **Поддержка форматов**: JPG, JPEG, PNG, GIF
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

### Быстрый старт:
docker-compose up --build
Откройте в браузере:
http://localhost:8080

## 🚀 Использование
Через веб-интерфейс:
Перейдите на главную страницу http://localhost:8080
Нажмите "Выберите файл" и выберите изображение
Нажмите "Загрузить"
Скопируйте ссылку на изображение из результата

Через API:
Загрузка изображения
curl -X POST -F "file=@your-image.jpg" http://localhost:8080/upload

### Просмотр изображения:
http://localhost:8080/images/a1b2c3d4e5.jpg

## 📁 Структура проекта:
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
### Поддерживаемые форматы:
[![JPG](https://img.shields.io/badge/JPG-yellow.svg)
[![PNG](https://img.shields.io/badge/PNG-blue.svg)
[![GIF](https://img.shields.io/badge/GIF-lightgrey.svg)

### Ограничения:
[![max-size-5MB](https://img.shields.io/badge/max--size-5MB-red.svg)

## 📊 Логирование:
Сервис ведет детальное логирование всех операций:
[2024-01-24 14:00:00] INFO: Изображение a1b2c3d4e5.jpg загружено успешно
[2024-01-24 14:01:00] ERROR: Неподдерживаемый формат: application/pdf
[2024-01-24 14:02:00] ERROR: Файл слишком большой: 6291456 bytes
Логи сохраняются в директории /logs и сохраняются между перезапусками.

## 🐳 Docker контейнеры:
[![docker-build](https://img.shields.io/badge/docker-build-2496ED.svg)
[![docker--compose-deploy](https://img.shields.io/badge/docker--compose-deploy-2496ED.svg)
Сервис состоит из двух контейнеров:
app
Порт: 8000 (внутренний)
Volume: /images, /logs
nginx
Веб-сервер для статических файлов
Порт: 8080 (внешний)
Volume: /images

## 🛡️ Безопасность:
[![security](https://img.shields.io/badge/security-green.svg)
Валидация MIME-типов файлов
Проверка расширений файлов
Ограничение размера загружаемых файлов
Nginx настроен для безопасной раздачи статических файлов
Автоматическая генерация имен файлов предотвращает перезапись

## 📈 Производительность:
[![performance-success](https://img.shields.io/badge/performance-success.svg)
Nginx обеспечивает высокоскоростную раздачу статических файлов
Оптимизированные Docker образы на основе Alpine Linux

## 🚦 Мониторинг:
Для мониторинга работы сервиса используйте:
# Просмотр логов приложения
docker-compose logs app
# Просмотр логов Nginx
docker-compose logs nginx
# Статус контейнеров
docker-compose ps

Приятного использования! 🎉