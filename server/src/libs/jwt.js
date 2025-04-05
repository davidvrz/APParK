import jwt from 'jsonwebtoken'
import { TOKEN_SECRET, TOKEN_SECRET_PARKING } from '../config.js'

export const generateAccessToken = (payload) => {
  const token = jwt.sign(
    { ...payload, type: 'user' },
    TOKEN_SECRET,
    { expiresIn: '30m' }
  )
  const decoded = jwt.decode(token)
  return {
    token,
    expiresIn: decoded.exp * 1000 // 30 minutos
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

export const generateParkingToken = ({ parkingId, nombre }) => {
  return jwt.sign(
    { type: 'parking', parkingId, nombre },
    TOKEN_SECRET_PARKING
  )
}

export const verifyUserToken = (token) => jwt.verify(token, TOKEN_SECRET)
export const verifyParkingToken = (token) => jwt.verify(token, TOKEN_SECRET_PARKING)
