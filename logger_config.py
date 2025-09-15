import logging
import sys
from logging.handlers import RotatingFileHandler


def get_logger():
    """
    Создает и настраивает логгер для приложения.
    """
    # Создание логгера
    logger = logging.getLogger("ImageServer")
    logger.setLevel(logging.INFO)

    # Проверяем, чтобы не добавлять обработчики повторно
    if logger.handlers:
        return logger

    # Форматтер для логов
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # Обработчик для вывода в консоль
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # Обработчик для записи в файл (с ротацией)
    try:
        file_handler = RotatingFileHandler(
            "server.log",
            maxBytes=5 * 1024 * 1024,  # 5 МБ
            backupCount=3,
            encoding='utf-8'
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    except Exception as e:
        logger.warning(f"Could not create file handler: {e}")

    return logger


# Для удобства можно также создать предварительно настроенный логгер
logger = get_logger()