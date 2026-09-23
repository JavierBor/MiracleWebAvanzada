# Servidor Web Nginx ligero para servir los archivos ya compilados
FROM nginx:alpine

# Copiamos la carpeta dist generada localmente hacia el directorio público de Nginx
COPY dist/Frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]