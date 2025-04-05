import { verifyUserToken, verifyParkingToken } from '../libs/jwt.js'
import jwt from 'jsonwebtoken'

export const parkingAccess = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  try {
    const decoded = jwt.decode(token)

    if (decoded?.type === 'parking') {
      const verified = verifyParkingToken(token)
      req.parking = verified

      const parkingIdFromRoute = parseInt(req.params.parkingId || req.body.parkingId)
      if (parkingIdFromRoute && verified.parkingId !== parkingIdFromRoute) {
        return res.status(403).json({ error: 'Acceso denegado para este parking' })
      }
      return next()
    }

    if (decoded?.type === 'user') {
      const verified = verifyUserToken(token)
      req.user = verified
      return next()
    }

    return res.status(403).json({ error: 'Tipo de token no válido' })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' })
    }
    return res.status(403).json({ error: 'Token inválido' })
  }
}
