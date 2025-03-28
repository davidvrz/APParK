import { verifyToken } from '../libs/jwt.js'

// Middleware para validar el access token desde el header
export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  try {
    const decoded = verifyToken(token)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' })
    }
    return res.status(403).json({ error: 'Token inválido' })
  }
}

// Middleware para validar el refresh token desde la cookie
export const refreshToken = (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken

  if (!refreshToken) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  try {
    const decoded = verifyToken(refreshToken)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expirado' })
    }
    return res.status(403).json({ error: 'Refresh token inválido' })
  }
}
