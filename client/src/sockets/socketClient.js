import io from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

let socket = null


export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    })

    // Configurar handlers básicos
    socket.on('connect', () => {
    })

    socket.on('disconnect', () => {
    })

    socket.on('error', (error) => {
      console.error('🔌 Error en socket:', error)
    })
  }

  return socket
}

export const getSocket = () => socket

export const joinParkingRoom = (parkingId) => {
  if (socket && socket.connected && parkingId) {
    socket.emit('join:parking', parkingId)
  }
}

export const leaveParkingRoom = (parkingId) => {
  if (socket && socket.connected && parkingId) {
    socket.emit('leave:parking', parkingId)
  }
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export const onSocketEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback)
  }
}

export const offSocketEvent = (event, callback) => {
  if (socket) {
    if (callback) {
      socket.off(event, callback)
    } else {
      socket.off(event)
    }
  }
}

export const emitSocketEvent = (event, data) => {
  if (socket && socket.connected) {
    socket.emit(event, data)
    return true
  }
  return false
}