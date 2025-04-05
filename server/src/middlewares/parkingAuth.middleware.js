import { verifyParkingToken } from '../libs/jwt.js'

export const parkingAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' })
  }

  try {
    const decoded = verifyParkingToken(token)

    const parkingIdFromRoute = parseInt(req.params.parkingId || req.body.parkingId)
    if (parkingIdFromRoute && decoded.parkingId !== parkingIdFromRoute) {
      return res.status(403).json({ error: 'Acceso denegado para este parking' })
    }

    req.parking = decoded
    next()
  } catch (error) {
    return res.status(403).json({ error: 'Token del parking inválido' })
  }
}
