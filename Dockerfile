# Production

FROM node:24-alpine

WORKDIR /app

# Копируем зависимости и устанавливаем их
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Копируем исходный код и собираем приложение
COPY . .
RUN npm run build

CMD ["npm", "start"]