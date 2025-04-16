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
