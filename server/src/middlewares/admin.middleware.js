export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'No autorizado' })
  }

  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' })
  }

  next()
}
