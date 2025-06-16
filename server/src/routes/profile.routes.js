import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { vehicleSchema } from '../schemas/vehicle.schema.js'
import {
  getProfile,
  updateProfile,
  addVehicle,
  updateVehicle,
  deleteVehicle,
  deleteAccount,
  getUserVehicles,
  adminGetAllUsers,
  adminGetUserById,
  adminDeleteUser
} from '../controllers/profile.controller.js'

const router = Router()

router.get('/', authenticate, getProfile)

router.put('/', authenticate, updateProfile)

router.get('/vehicles', authenticate, getUserVehicles)

router.post('/vehicle', authenticate, validateSchema(vehicleSchema), addVehicle)

router.put('/vehicle/:id', authenticate, validateSchema(vehicleSchema), updateVehicle)

router.delete('/vehicle/:id', authenticate, deleteVehicle)

router.delete('/', authenticate, deleteAccount)

// Admin routes
router.get('/admin/users', authenticate, adminGetAllUsers)

router.get('/admin/users/:id', authenticate, adminGetUserById)

router.delete('/admin/users/:id', authenticate, adminDeleteUser)

export default router
