# 1. Aşama: Derleme
FROM node:20-alpine AS build
WORKDIR /app

# npm install yerine 'npm ci' kullanarak exact paket sürümlerini garantiye alın
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# 2. Aşama: Nginx ile sunma
FROM nginx:alpine

# Nginx varsayılan karşılama dosyalarını temizleyin
RUN rm -rf /usr/share/nginx/html/*

# Derlenen statik dosyaları aktarın
COPY --from=build /app/dist /usr/share/nginx/html

# Özel Nginx yapılandırmasını ekleyin
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]