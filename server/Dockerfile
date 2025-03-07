# Usamos la imagen oficial de Node.js
FROM node:18

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de package.json y package-lock.json
COPY package*.json ./

# Instalamos las dependencias del backend
RUN npm install

# Copiamos todo el código del backend
COPY . .

# Exponemos el puerto en el que el backend va a correr
EXPOSE 3000

# Comando para iniciar el backend
CMD ["npm", "start"]
