#!/usr/bin/env python3
"""
Скрипт для создания резервных копий базы данных
"""

import os
import subprocess
import datetime
from logger_config import get_logger

logger = get_logger()


def create_backup():
    """Создает резервную копию базы данных."""
    try:
        # Создаем имя файла с timestamp
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_%H%M%S")
        backup_filename = f"backup_{timestamp}.sql"
        backup_path = os.path.join("/app/backups", backup_filename)

        # Команда для создания бэкапа
        cmd = [
            'pg_dump',
            '-h', 'db',
            '-U', 'postgres',
            '-d', 'images_db',
            '-f', backup_path
        ]

        # Устанавливаем переменную окружения с паролем
        env = os.environ.copy()
        env['PGPASSWORD'] = 'password'

        # Выполняем команду
        result = subprocess.run(cmd, env=env, capture_output=True, text=True)

        if result.returncode == 0:
            logger.info(f"Backup created successfully: {backup_filename}")
            return True
        else:
            logger.error(f"Backup failed: {result.stderr}")
            return False

    except Exception as e:
        logger.error(f"Backup error: {e}")
        return False


if __name__ == "__main__":
    create_backup()