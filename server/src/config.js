import 'dotenv/config'

export const PORT = process.env.PORT || 3000

// Configuración de la base de datos MySQL
export const DB = {
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || '',
  NAME: process.env.DB_NAME || 'parksystem',
  PORT: process.env.DB_PORT || 3306
}

export const redisConfig = {
  redisHost: process.env.REDIS_HOST || 'localhost',
  redisPort: process.env.REDIS_PORT || 6379
}

// URL del frontend para permitir CORS
// export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173' // En producción, esta URL debe ser la del frontend (3001 -> Docker)
export const FRONTEND_URL = 'http://localhost:5173'

export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'smart-park-system-secret-token'
export const TOKEN_SECRET_PARKING = process.env.TOKEN_SECRET_PARKING || 'sistema-interno-provisional-token'

export const RESERVA_TIEMPO_MIN = 15 // minutos
export const RESERVA_TIEMPO_MAX = 480 // minutos
export const RESERVA_ANTICIPACION_MIN = 30 // minutos
