# Franchie Backend

Это Docker-конфигурация для запуска бэкенда Franchie.

## Требования

- Docker
- Docker Compose

## Быстрый старт

1. Склонируйте репозиторий:
```bash
git clone https://github.com/mirdan2207/franchie-backend
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

- Backend API: http://localhost/api/*
- Swagger документация: swagger.yaml
- Grafana: http://localhost:3001 (admin/admin)


## Остановка сервисов

```bash
docker-compose down
```

Для полной очистки данных (включая базу данных):
```bash
docker-compose down -v
``` 