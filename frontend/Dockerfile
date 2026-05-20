# =====================================================
# DOCKERFILE — Frontend (nginx)
# =====================================================
# nginx sirve los archivos estáticos (HTML/CSS/JS)
# como un servidor web real.
# =====================================================

FROM nginx:alpine

# Elimina la página de bienvenida por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todos los archivos del frontend al directorio
# que nginx usa para servir contenido estático
COPY . /usr/share/nginx/html

# Puerto estándar HTTP
EXPOSE 80
