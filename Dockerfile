FROM node:20-slim

WORKDIR /app

# Установка необходимых зависимостей
RUN apt-get update && apt-get install -y openssl libssl3 tzdata && rm -rf /var/lib/apt/lists/*

# Установка временной зоны
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"] 