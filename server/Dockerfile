# Usamos la imagen oficial de Node.js
FROM node:18

# Variable de entorno para determinar el modo (viene de docker-compose o Railway)
ARG NODE_ENV

# Convertir ARG a ENV para runtime
ENV NODE_ENV=$NODE_ENV

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm ci

# Copiamos todo el código fuente
COPY . .

# Exponemos el puerto donde correrá Express
EXPOSE 3000

# Comando para iniciar el servidor en modo producción
CMD ["npm", "start"]
