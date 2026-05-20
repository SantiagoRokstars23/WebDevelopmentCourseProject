# =====================================================
# DOCKERFILE — Backend Node.js
# =====================================================
# Usamos la imagen oficial de Node.js en su versión
# alpine (mucho más ligera que la imagen completa)
# =====================================================

# ETAPA 1: imagen base
FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia primero solo los archivos de dependencias.
# Docker cachea esta capa: si package.json no cambia,
# no vuelve a ejecutar npm install en cada build.
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm install --only=production

# Copia el resto del código fuente
# (el .dockerignore excluye node_modules y .env)
COPY . .

# Puerto que expone el contenedor (debe coincidir con PORT en .env)
EXPOSE 3000

# Comando para iniciar el servidor en producción (sin nodemon)
CMD ["node", "server.js"]
