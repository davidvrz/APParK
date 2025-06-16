import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { parkingAccess } from '../middlewares/parkingAccess.middleware.js'
import { parkingAuth } from '../middlewares/parkingAuth.middleware.js'
import { requireAdmin } from '../middlewares/admin.middleware.js'
import { parkingSchema } from '../schemas/parking.schema.js'
import { plantaSchema } from '../schemas/planta.schema.js'
import { plazaSchema } from '../schemas/plaza.schema.js'
import { anuncioSchema } from '../schemas/anuncio.schema.js'
import { reservaRapidaSchema } from '../schemas/reservaRapida.schema.js'
import {
  getAllParkings,
  getParkingById,
  createParking,
  updateParking,
  deleteParking,
  getPlantaById,
  createPlanta,
  deletePlanta,
  getPlazaById,
  createPlaza,
  updatePlaza,
  deletePlaza,
  getAnunciosByParkingId,
  createAnuncio,
  updateAnuncio,
  deleteAnuncio
} from '../controllers/parking.controller.js'
import {
  getReservasParking,
  getReservasRapidasParking,
  createReservaRapida,
  completeReservaRapida
} from '../controllers/reserva.controller.js'
import {
  getEventosByParkingId,
  procesarEventoSensor
} from '../controllers/eventos.controller.js'

const router = Router()

router.get('/', parkingAccess, getAllParkings)
router.get('/:parkingId', parkingAccess, getParkingById)
router.get('/:parkingId/plantas/:plantaId', parkingAccess, getPlantaById)
router.get('/:parkingId/plantas/:plantaId/plazas/:plazaId', parkingAccess, getPlazaById)

// admin123
router.post('/', authenticate, requireAdmin, validateSchema(parkingSchema), createParking)
router.put('/:parkingId', authenticate, requireAdmin, validateSchema(parkingSchema), updateParking)
router.delete('/:parkingId', authenticate, requireAdmin, deleteParking)

router.post('/:parkingId/plantas', authenticate, requireAdmin, validateSchema(plantaSchema), createPlanta)
router.delete('/:parkingId/plantas/:plantaId', authenticate, requireAdmin, deletePlanta)

router.post('/:parkingId/plantas/:plantaId/plazas', authenticate, requireAdmin, validateSchema(plazaSchema), createPlaza)
router.put('/:parkingId/plantas/:plantaId/plazas/:plazaId', authenticate, requireAdmin, validateSchema(plazaSchema), updatePlaza)
router.delete('/:parkingId/plantas/:plantaId/plazas/:plazaId', authenticate, requireAdmin, deletePlaza)

router.get('/:parkingId/anuncios', authenticate, getAnunciosByParkingId)
router.post('/:parkingId/anuncios', authenticate, requireAdmin, validateSchema(anuncioSchema), createAnuncio)
router.put('/:parkingId/anuncios/:id', authenticate, requireAdmin, validateSchema(anuncioSchema), updateAnuncio)
router.delete('/:parkingId/anuncios/:id', authenticate, requireAdmin, deleteAnuncio)

router.get('/:parkingId/reservas', authenticate, getReservasParking)
router.get('/:parkingId/rapidas', authenticate, requireAdmin, getReservasRapidasParking)

router.post('/:parkingId/quick', parkingAuth, validateSchema(reservaRapidaSchema), createReservaRapida)
router.patch('/:parkingId/complete', authenticate, requireAdmin, completeReservaRapida)

router.get('/:parkingId/eventos', authenticate, requireAdmin, getEventosByParkingId)
router.post('/:parkingId/sensor', parkingAuth, procesarEventoSensor)

export default router
