import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import profileRoutes from './routes/profile.routes.js'
import parkingRoutes from './routes/parking.routes.js'
import reservaRoutes from './routes/reserva.routes.js'
import bullBoardRouter from './jobs/monitor.js'

const app = express()

// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true // Permitir cookies desde el frontend
}))

// Helmet añade encabezados de seguridad HTTP → Protección contra XSS y clicjacking
app.use(helmet())

// Cookie parser para leer cookies HTTP-only
app.use(cookieParser())

// Permitir parsing de JSON y datos de formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger → Morgan para logs de solicitudes HTTP (usar 'combined' en producción)
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Rutas principales
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/parking', parkingRoutes)
app.use('/api/reserva', reservaRoutes)
app.use('/admin/queues', bullBoardRouter)

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Middleware para manejo de errores internos (500)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

export default app
