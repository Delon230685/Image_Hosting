# 🖼️ Image Hosting Service

[![Python 3.13](https://img.shields.io/badge/python-3.13-blue.svg)](https://www.python.org/downloads/release/python-312/)
[![Docker](https://img.shields.io/badge/docker-✓-blue.svg)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/nginx-✓-brightgreen.svg)](https://nginx.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

Сервис для хранения и обмена изображениями с простым веб-интерфейсом и API. Пользователи могут загружать изображения и получать прямые ссылки для использования в соцсетях, блогах или мессенджерах.

## ✨ Возможности

### 🔄 Управление изображениями
- **Загрузка изображений** через веб-интерфейс или API
- **Просмотр списка** всех загруженных изображений с метаданными
- **Удаление изображений** через веб-интерфейс
- **Пагинация** списка изображений (по 10 на странице)

### 💾 Хранение данных
- **PostgreSQL** для хранения метаданных изображений
- **Автоматическое сохранение** метаданных при загрузке
- **Резервное копирование** базы данных
- **Docker Volumes** для persistent storage

### 🛡️ Безопасность и надежность
- **Валидация MIME-типов** файлов
- **Проверка расширений** файлов
- **Ограничение размера** загружаемых файлов
- **Автоматическая генерация** уникальных имен файлов
- **Логирование** всех операций

## 🛠️ Технологии

[![Pillow](https://img.shields.io/badge/Pillow-10.0-lightgrey.svg)](https://python-pillow.org/)
[![Psycopg2](https://img.shields.io/badge/psycopg2-2.9-blue.svg)](https://www.psycopg.org/)
[![PostgreSQL 15](https://img.shields.io/badge/postgresql-15-336791.svg)](https://www.postgresql.org/)
[![Uvicorn](https://img.shields.io/badge/uvicorn-0.24-ff69b4.svg)](https://www.uvicorn.org/)
[![Docker Compose](https://img.shields.io/badge/docker--compose-2.0-blue.svg)](https://docs.docker.com/compose/)
[![Alpine Linux](https://img.shields.io/badge/alpine-3.18-0d597f.svg)](https://alpinelinux.org/)

- **Backend**: Python 3.13
- **Database**: PostgreSQL 15
- **Frontend**: JavaScript, CSS, HTML
- **Web Server**: Nginx
- **Контейнеризация**: Docker + Docker Compose
- **Обработка изображений**: Pillow
- **База данных**: Psycopg2

## 📦 Установка и запуск

### Предварительные требования

[![Docker 20.10+](https://img.shields.io/badge/docker-20.10%2B-2496ED.svg)](https://docs.docker.com/engine/install/)
[![Docker Compose 2.0+](https://img.shields.io/badge/docker--compose-2.0%2B-2496ED.svg)](https://docs.docker.com/compose/install/)

- Docker Engine 20.10+
- Docker Compose 2.0+

### Быстрый старт:
- docker-compose up --build
- Откройте в браузере:
http://localhost:8080

## 📁 Структура проекта:
```
image-hosting/
├── app/                 # Основной файл Python
├── image/               # Папка для хранения загруженных картинок пользователем
├── logs/                # Папка для хранения логов
│   └── image_server.log # лог-файл используемый сервером для работы с изображениями
├── static/              # Папка для хранения статических файлов
│   └── assets           # Папка для хранения дополнительных статических ресурсов
│       ├── images/      # Папка с файлами для фона
│       ├── index.html   # Главная HTML-страница веб-приложения
│       ├── script.js    # Подключение JavaScript
│       └── style.css    # Подключение стилей CSS
├── requirements.txt     # Зависимости Python
├── Dockerfile           # Конфигурация образа приложения
├── docker-compose.yml   # Docker Compose конфигурация
├── nginx/               # Папка для статистики
        └── nginx.conf   # Конфигурация Nginx
├── init.sql             # Скрипт структуры БД (таблица)
├── backup_script.py     # Скрипт для создания резервных копий базы данных
├── backups              # Папка для хранения резервных копий
├── logger_config.py     # Настройки логера
├── .gitignore           # Список файлов и папок не отслеживаемых Git.
└── README.md            # Документация
```
### Поддерживаемые форматы:
[![JPG](https://img.shields.io/badge/JPG-yellow.svg)]()
[![PNG](https://img.shields.io/badge/PNG-blue.svg)]()
[![GIF](https://img.shields.io/badge/GIF-lightgrey.svg)]()

### Ограничения:
[![max-size-5MB](https://img.shields.io/badge/max--size-5MB-red.svg)]()

## 📊 Логирование:
- Сервис ведет детальное логирование всех операций:
- [2025-09-24 14:00:00] INFO: Изображение a1b2c3d4e5.jpg загружено успешно
- [2025-09-24 14:01:00] ERROR: Неподдерживаемый формат: application/pdf
- [2025-09-24 14:02:00] ERROR: Файл слишком большой: 6291456 bytes
- Логи сохраняются в директории /logs и сохраняются между перезапусками.

## 🗂️ Пагинация
- Список изображений разбивается на страницы по 10 элементов. Навигация включает:
- Кнопки "Предыдущая" и "Следующая" страницы
- Отображение текущей страницы и общего количества
- Автоматическая корректировка при граничных условиях

# Метаданные изображений
- При загрузке каждого изображения сохраняются следующие метаданные:
- ID: Уникальный идентификатор
- Filename: Сгенерированное имя файла
- Original Name: Оригинальное имя от пользователя
- Size: Размер файла в байтах
- Upload Time: Дата и время загрузки
- File Type: Формат файла (jpg, png, gif)

## 🌐 Веб-интерфейс
- Главная страница (/)
- Загрузка новых изображений
- Drag & drop интерфейс
- Валидация форматов и размера

# Список изображений (/images-list)
- Таблица со всеми загруженными изображениями
- Информация для каждого изображения:
- Имя файла со ссылкой для просмотра
- Оригинальное имя файла
- Размер файла в КБ
- Дата и время загрузки
- Тип файла
- Кнопка "Удалить" для каждого изображения
- Пагинация (по 10 изображений на странице)

## 💾 Резервное копирование
- Автоматическое резервное копирование
# Создание резервной копии вручную
docker exec -t image-hosting-db-1 pg_dump -U postgres images_db > backups/backup_$(date +%Y-%m-%d_%H%M%S).sql
# Использование скрипта
- python backup_script.py
- Восстановление из резервной копии
docker exec -i image-hosting-db-1 psql -U postgres images_db < backups/backup_2024-01-24_153000.sql
# Резервные копии сохраняются в папке /backups с timestamp в имени файла.

## 🐳 Docker контейнеры:
[![docker-build](https://img.shields.io/badge/docker-build-2496ED.svg)]()
[![docker--compose-deploy](https://img.shields.io/badge/docker--compose-deploy-2496ED.svg)]()
- Сервис состоит из трех контейнеров:
# 🐍 app (Python Backend)
- Порт: 8000 (внутренний)
- Volume: /images, /logs
- Зависимости: PostgreSQL connection

# 🗄️ db (PostgreSQL Database)
- Порт: 5432 (внутренний)
- Volume: db_data
- База данных: images_db

# 🌐 nginx (Web Server)
- Порт: 8080 (внешний)
- Volume: /images
- Назначение: Раздача статических файлов

## 🛡️ Безопасность:
[![security](https://img.shields.io/badge/security-green.svg)]()
- Валидация MIME-типов файлов
- Проверка расширений файлов
- Ограничение размера загружаемых файлов
- Nginx настроен для безопасной раздачи статических файлов
- Автоматическая генерация имен файлов предотвращает перезапись

## 📈 Производительность:
[![performance-success](https://img.shields.io/badge/performance-success.svg)]()
- Nginx обеспечивает высокоскоростную раздачу статических файлов
- Оптимизированные Docker образы на основе Alpine Linux

## 🚦 Мониторинг:
Для мониторинга работы сервиса используйте:
# Просмотр логов приложения
docker-compose logs app
# Просмотр логов Nginx
docker-compose logs nginx
# Статус контейнеров
docker-compose ps

# Приятного использования! 🎉