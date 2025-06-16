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
    // Unirse a una sala de parking
    socket.on('join:parking', (parkingId) => {
      socket.join(`parking:${parkingId}`)
    })

    // Salir de la sala
    socket.on('leave:parking', (parkingId) => {
      socket.leave(`parking:${parkingId}`)
    })

    socket.on('disconnect', () => {
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
