# Usamos la imagen oficial de Node.js
FROM node:18

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias del frontend
RUN npm install

# Copiamos todo el código del frontend
COPY . .

# Exponemos el puerto en el que el frontend va a correr
EXPOSE 3001

# Comando para iniciar el frontend
CMD ["npm", "run", "dev"]
