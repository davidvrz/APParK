# Usamos la imagen oficial de Node.js
FROM node:18

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias (directamente en el contenedor)
RUN npm ci

# Exponemos el puerto donde correrá Express
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "run", "dev"]
