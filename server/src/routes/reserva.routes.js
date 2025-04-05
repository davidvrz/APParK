import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import { createReserva, getReservasByUser, updateReserva, cancelReserva, deleteReserva, getHistorialReservasByUser, quickReserve, completeReserva, getReservasActivas } from '../controllers/reserva.controller.js'
import { checkAvailability } from '../middlewares/availability.middleware.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { reservaSchema } from '../schemas/reserva.schema.js'
import { parkingAuth } from '../middlewares/parkingAuth.middleware.js'
import { requireAdmin } from '../middlewares/admin.middleware.js'

const router = Router()

router.post('/', authenticate, validateSchema(reservaSchema), checkAvailability, createReserva)
router.get('/', authenticate, getReservasByUser)
router.put('/:reservaId', authenticate, validateSchema(reservaSchema), updateReserva)
router.patch('/:reservaId', authenticate, cancelReserva)
router.delete('/:reservaId', authenticate, requireAdmin, deleteReserva)
router.get('/historial', authenticate, getHistorialReservasByUser)

// Rutas especiales del sistema interno
router.post('/quick', parkingAuth, quickReserve)
router.patch('/:reservaId/complete', parkingAuth, completeReserva)
router.get('/activas', parkingAuth, getReservasActivas)

export default router
