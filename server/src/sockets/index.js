import { Server } from 'socket.io'

let io

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    console.log(`📡 Cliente conectado: ${socket.id}`)

    // Unirse a una sala de parking
    socket.on('join:parking', (parkingId) => {
      socket.join(`parking:${parkingId}`)
      console.log(`🔵 Cliente ${socket.id} unido a sala parking:${parkingId}`)
    })

    // Salir de la sala
    socket.on('leave:parking', (parkingId) => {
      socket.leave(`parking:${parkingId}`)
      console.log(`🔴 Cliente ${socket.id} salió de sala parking:${parkingId}`)
    })

    socket.on('disconnect', () => {
      console.log(`❌ Cliente desconectado: ${socket.id}`)
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io no ha sido inicializado')
  }
  return io
}
