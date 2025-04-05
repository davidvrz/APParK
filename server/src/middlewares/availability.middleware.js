import Plaza from '../models/plaza.model.js'

export const checkAvailability = async (req, res, next) => {
  const { plazaId } = req.body

  const plaza = await Plaza.findByPk(plazaId)

  if (!plaza) {
    return res.status(404).json({ error: 'Plaza no encontrada' })
  }

  if (plaza.estado !== 'Libre') {
    return res.status(400).json({ error: 'Plaza no disponible' })
  }

  next()
}
