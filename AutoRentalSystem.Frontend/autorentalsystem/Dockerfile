# ===== Стадия сборки =====
FROM node:20-alpine AS build

WORKDIR /app

# Устанавливаем системные зависимости
RUN apk add --no-cache libc6-compat

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm ci

# Копируем остальные файлы
COPY . .

# Указываем публичный адрес API для фронта
ENV NEXT_PUBLIC_API_URL=http://api:5003

# Собираем Next.js
RUN npm run build


# ===== Стадия выполнения =====
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Копируем нужные артефакты
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./

# Устанавливаем только продакшн зависимости
RUN npm ci --omit=dev

EXPOSE 3000

# Запуск продакшн сервера
CMD ["npm", "start"]
