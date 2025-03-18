import { Router } from 'express'
import { accessMiddleware } from '../middlewares/auth.middleware.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { vehicleSchema } from '../schemas/vehicle.schema.js'
import { getProfile, updateProfile, addVehicle, updateVehicle, deleteVehicle, deleteAccount } from '../controllers/profile.controller.js'

const router = Router()

// ✅ Obtener perfil de usuario
router.get('/', accessMiddleware, getProfile)

// ✅ Actualizar perfil
router.put('/', accessMiddleware, updateProfile)

// ✅ Añadir vehículo
router.post('/vehicle', accessMiddleware, validateSchema(vehicleSchema), addVehicle)

// ✅ Actualizar vehículo
router.put('/vehicle/:id', accessMiddleware, validateSchema(vehicleSchema), updateVehicle)

// ✅ Eliminar vehículo
router.delete('/vehicle/:id', accessMiddleware, deleteVehicle)

// ✅ Eliminar cuenta de usuario
router.delete('/', accessMiddleware, deleteAccount)

export default router
