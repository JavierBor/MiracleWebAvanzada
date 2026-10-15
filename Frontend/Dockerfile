# Etapa 1: Compilar Angular / Ionic
FROM node:24-alpine AS build

WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalación reproducible
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar aplicación
RUN npm run build -- --configuration=production

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Configuración SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar compilación desde la primera etapa
COPY --from=build /app/dist/Frontend/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
