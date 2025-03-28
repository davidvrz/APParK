import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { parkingAccess } from '../middlewares/parkingAccess.middleware.js'
import { requireAdmin } from '../middlewares/admin.middleware.js'
import { parkingSchema } from '../schemas/parking.schema.js'
import { plantaSchema } from '../schemas/planta.schema.js'
import { plazaSchema } from '../schemas/plaza.schema.js'

import {
  getAllParkings,
  getParkingState,
  createParking,
  updateParking,
  deleteParking,
  getPlantaState,
  createPlanta,
  deletePlanta,
  getPlazaState,
  createPlaza,
  updatePlaza,
  deletePlaza
} from '../controllers/parking.controller.js'

const router = Router()

router.get('/', parkingAccess, getAllParkings)
router.get('/:parkingId', parkingAccess, getParkingState)
router.get('/:parkingId/plantas/:plantaId', parkingAccess, getPlantaState)
router.get('/:parkingId/plantas/:plantaId/plazas/:plazaId', parkingAccess, getPlazaState)

// admin123
router.post('/', authenticate, requireAdmin, validateSchema(parkingSchema), createParking)
router.put('/:parkingId', authenticate, requireAdmin, validateSchema(parkingSchema), updateParking)
router.delete('/:parkingId', authenticate, requireAdmin, deleteParking)

router.post('/:parkingId/plantas', authenticate, requireAdmin, validateSchema(plantaSchema), createPlanta)
router.delete('/:parkingId/plantas/:plantaId', authenticate, requireAdmin, deletePlanta)

router.post('/:parkingId/plantas/:plantaId/plazas', authenticate, requireAdmin, validateSchema(plazaSchema), createPlaza)
router.put('/:parkingId/plantas/:plantaId/plazas/:plazaId', authenticate, requireAdmin, validateSchema(plazaSchema), updatePlaza)
router.delete('/:parkingId/plantas/:plantaId/plazas/:plazaId', authenticate, requireAdmin, deletePlaza)

export default router
