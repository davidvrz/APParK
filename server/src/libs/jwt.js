import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'

// Access Token → Expira en 30 minutos
export const generateAccessToken = (payload) => {
  const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '30m' })
  const decoded = jwt.decode(token)
  return {
    token,
    expiresIn: decoded.exp * 1000 // Convertir a milisegundos para el frontend
  }
}

// Refresh Token → Expira en 7 días
export const generateRefreshToken = (payload) => {
  const token = jwt.sign(payload, TOKEN_SECRET, { expiresIn: '7d' })
  const decoded = jwt.decode(token)
  return {
    token,
    expiresIn: decoded.exp * 1000
  }
}

export const verifyToken = (token) => jwt.verify(token, TOKEN_SECRET)
