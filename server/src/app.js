import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import userRoutes from './routes/user.routes.js'

const app = express()

// Habilitar CORS para permitir solicitudes desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true // Permitir cookies desde el frontend
}))

// Helmet añade encabezados de seguridad HTTP → Protección contra XSS y ataques de clicjacking
app.use(helmet())

// Cookie parser para leer cookies HTTP-only
app.use(cookieParser())

// Permitir parsing de JSON y datos de formularios
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Logger → Morgan para logs de solicitudes HTTP
app.use(morgan('dev'))

// 👉 Aquí definimos las rutas principales
app.use('/api/auth', userRoutes)

// 🔥 👇 Esto debe ir al final
// Middleware para rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' })
})

// Middleware para errores internos
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
})

export default app
