# Etapa 1: Construcción (Node.js)
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Compila el proyecto Angular automáticamente por ti
RUN npm run build 

# Etapa 2: Producción (Nginx)
FROM nginx:alpine
# Copia el resultado desde la Etapa 1
COPY --from=builder /app/dist/Frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]