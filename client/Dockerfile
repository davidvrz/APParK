# Usamos la imagen oficial de Node.js
FROM node:18

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos los archivos de configuración para instalar dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm ci

# Copiamos todo el código fuente
COPY . .

# Variable de entorno para determinar el modo (viene de docker-compose o Railway)
ARG NODE_ENV

# Convertir ARG a ENV para runtime
ENV NODE_ENV=$NODE_ENV

# Condicional: si es producción, construimos y usamos serve
RUN if [ "$NODE_ENV" = "production" ] ; then npm run build && npm install -g serve ; fi

# Exponemos puertos (5173 para dev, 5000 para prod)
EXPOSE 5173 5000

# Comando condicional basado en NODE_ENV
CMD if [ "$NODE_ENV" = "production" ] ; then serve -s dist -l 5000 ; else npm run dev ; fi
