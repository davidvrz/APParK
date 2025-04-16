import app from './app.js'
import 'dotenv/config'
import { connectDB } from './database/db.js'
import { Server as SocketServer } from 'socket.io'
import { initSocket } from './sockets/index.js'
import http from 'http'
import './jobs/reserva.worker.js'

const PORT = process.env.PORT || 3000

const server = http.createServer(app)
const io = new SocketServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST']
  }
})
const main = async () => {
  try {
    await connectDB()
    initSocket(io)
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error)
    process.exit(1)
  }
}

main()
