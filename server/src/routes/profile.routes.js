import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { vehicleSchema } from '../schemas/vehicle.schema.js'
import { getProfile, updateProfile, addVehicle, updateVehicle, deleteVehicle, deleteAccount } from '../controllers/profile.controller.js'

const router = Router()

// ✅ Obtener perfil de usuario
router.get('/', authenticate, getProfile)

// ✅ Actualizar perfil
router.put('/', authenticate, updateProfile)

// ✅ Añadir vehículo
router.post('/vehicle', authenticate, validateSchema(vehicleSchema), addVehicle)

// ✅ Actualizar vehículo
router.put('/vehicle/:id', authenticate, validateSchema(vehicleSchema), updateVehicle)

// ✅ Eliminar vehículo
router.delete('/vehicle/:id', authenticate, deleteVehicle)

// ✅ Eliminar cuenta de usuario
router.delete('/', authenticate, deleteAccount)

export default router
