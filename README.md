# Franchie Backend

Это Docker-конфигурация для запуска бэкенда Franchie.

## Требования

- Docker
- Docker Compose

## Быстрый старт

1. Склонируйте репозиторий:
```bash
git clone <repository-url>
cd franchie-backend
```

2. Создайте файл .env на основе .env.example:
```bash
cp .env.example .env
```

3. Запустите сервисы:
```bash
docker-compose up -d
```

## Доступные сервисы

- Backend API: http://localhost:3000
- Swagger документация: http://localhost:3000/api-docs
- Grafana: http://localhost:3001 (admin/admin)

## Переменные окружения

Создайте файл `.env` со следующими переменными:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=franchie
```

## Остановка сервисов

```bash
docker-compose down
```

Для полной очистки данных (включая базу данных):
```bash
docker-compose down -v
``` 