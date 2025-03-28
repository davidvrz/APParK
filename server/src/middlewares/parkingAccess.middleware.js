import { verifyToken } from '../libs/jwt.js'

export const parkingAccess = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  // ✅ 1. Si el token es el del sistema → Permitir acceso
  if (token === process.env.SYSTEM_ACCESS_TOKEN) {
    req.systemAccess = true
    return next()
  }

  // ✅ 2. Si el token es un token JWT → Autenticar como usuario
  try {
    const decoded = verifyToken(token)
    req.user = decoded
    return next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' })
    }
    return res.status(403).json({ error: 'Token inválido' })
  }
}
