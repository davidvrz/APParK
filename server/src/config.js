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

// URL del frontend para permitir CORS
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

export const TOKEN_SECRET = process.env.TOKEN_SECRET || 'smart-park-system-secret-token'

export const config = { systemAccessToken: process.env.SYSTEM_ACCESS_TOKEN }
