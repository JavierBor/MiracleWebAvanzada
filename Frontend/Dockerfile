# Etapa 1: Construcción (Node.js)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Compila el proyecto Angular automáticamente por ti
RUN npm run build 

# Etapa 2: Producción (Nginx)
# Servidor Web Nginx ligero
FROM nginx:alpine
# Copiamos la configuración con soporte para el router de Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiamos la carpeta compilada (ajusta con /browser si tu Angular compila en browser)
COPY dist/Frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]