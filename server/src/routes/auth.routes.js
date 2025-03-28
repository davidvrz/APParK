import { Router } from 'express'
import { register, login, refreshAccessToken, logout } from '../controllers/auth.controller.js'
import { authenticate, refreshToken } from '../middlewares/auth.middleware.js'
import validateSchema from '../middlewares/validator.middleware.js'
import { registerSchema, loginSchema } from '../schemas/auth.schema.js'

const router = Router()

// Registro de usuario
router.post('/register', validateSchema(registerSchema), register)

// Inicio de sesión
router.post('/login', validateSchema(loginSchema), login)

// Renovación de token
router.post('/refresh', refreshToken, refreshAccessToken)

// Cerrar sesión
router.post('/logout', authenticate, logout)

export default router
