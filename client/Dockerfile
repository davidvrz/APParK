# Usamos la imagen oficial de Node.js
FROM node:18

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de configuración para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias de manera consistente
RUN npm ci

# Copiamos el resto del código del frontend (excluye archivos en .dockerignore)
COPY . .

# Exponemos el puerto en el que corre Vite
EXPOSE 5173

# Comando para iniciar el frontend
CMD ["npm", "run", "dev"]
