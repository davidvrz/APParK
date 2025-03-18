# Usamos la imagen oficial de Node.js
FROM node:18

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de configuración para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias de manera consistente
RUN npm ci

# Exponemos el puerto en el que corre Vite
EXPOSE 5173

# Comando para iniciar el frontend
CMD ["npm", "run", "dev"]
