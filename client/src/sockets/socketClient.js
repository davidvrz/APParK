import io from 'socket.io-client'

// Asumimos que el servidor socket.io está en la misma URL base que la API
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

let socket = null

/**
 * Inicializa la conexión a socket.io si no existe
 * @returns {SocketIOClient.Socket} El cliente socket
 */
export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    })

    // Configurar handlers básicos
    socket.on('connect', () => {
      console.log('🔌 Socket conectado:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('🔌 Socket desconectado')
    })

    socket.on('error', (error) => {
      console.error('🔌 Error en socket:', error)
    })
  }

  return socket
}

/**
 * Obtiene la instancia actual del socket
 * @returns {SocketIOClient.Socket|null} El socket actual o null si no está inicializado
 */
export const getSocket = () => socket

/**
 * Une el socket a una sala específica para un parking
 * @param {number} parkingId - ID del parking
 */
export const joinParkingRoom = (parkingId) => {
  if (socket && socket.connected && parkingId) {
    socket.emit('join:parking', parkingId)
  }
}

/**
 * Abandona la sala de un parking específico
 * @param {number} parkingId - ID del parking
 */
export const leaveParkingRoom = (parkingId) => {
  if (socket && socket.connected && parkingId) {
    socket.emit('leave:parking', parkingId)
  }
}

/**
 * Desconecta el socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

/**
 * Suscribe a un evento de socket
 * @param {string} event - Nombre del evento
 * @param {function} callback - Función callback para el evento
 */
export const onSocketEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback)
  }
}

/**
 * Remueve la suscripción a un evento de socket
 * @param {string} event - Nombre del evento
 * @param {function} [callback] - Función callback específica (opcional)
 */
export const offSocketEvent = (event, callback) => {
  if (socket) {
    if (callback) {
      socket.off(event, callback)
    } else {
      socket.off(event)
    }
  }
}

/**
 * Emite un evento al servidor
 * @param {string} event - Nombre del evento
 * @param {any} data - Datos a enviar
 * @returns {boolean} - Si se pudo emitir el evento
 */
export const emitSocketEvent = (event, data) => {
  if (socket && socket.connected) {
    socket.emit(event, data)
    return true
  }
  return false
}