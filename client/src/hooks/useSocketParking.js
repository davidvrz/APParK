import { useState, useEffect, useCallback } from 'react'
import {
  initSocket,
  joinParkingRoom,
  leaveParkingRoom,
  onSocketEvent,
  offSocketEvent,
  emitSocketEvent
} from '@/sockets/socketClient'

export const useSocketParking = (parkingId) => {
  const [connected, setConnected] = useState(false)
  const [plazasActualizadas, setPlazasActualizadas] = useState([])

  // Método para conectar al socket y suscribirse a eventos
  const connectToSocket = useCallback(() => {
    const socket = initSocket()

    // Suscribirse a eventos de conexión/desconexión
    const onConnect = () => {
      setConnected(true)
      if (parkingId) {
        joinParkingRoom(parkingId)
      }
    }

    const onDisconnect = () => {
      setConnected(false)
    }

    // Actualización del parking cuando cambia una plaza
    const onParkingUpdate = (data) => {
      if (data && data.plazaId) {
        setPlazasActualizadas(prev => {
          const newUpdate = {
            id: data.plazaId,
            estado: data.nuevoEstado,
            timestamp: new Date(),
            tipo: data.tipo
          }
          return [...prev, newUpdate]
        })
      }
    }

    // Registrar los handlers
    onSocketEvent('connect', onConnect)
    onSocketEvent('disconnect', onDisconnect)
    onSocketEvent('parking:update', onParkingUpdate)

    // Verificar si ya está conectado inicialmente
    if (socket && socket.connected) {
      onConnect()
    }

    // Cleanup al desmontar
    return () => {
      if (parkingId) {
        leaveParkingRoom(parkingId)
      }
      offSocketEvent('connect', onConnect)
      offSocketEvent('disconnect', onDisconnect)
      offSocketEvent('parking:update', onParkingUpdate)
    }
  }, [parkingId])

  // Conectar/desconectar cuando cambia el parkingId
  useEffect(() => {
    const cleanup = connectToSocket()
    return cleanup
  }, [connectToSocket])

  // Auto-limpiar actualizaciones después de 3 segundos
  useEffect(() => {
    if (plazasActualizadas.length === 0) return

    const timeout = setTimeout(() => {
      setPlazasActualizadas(prev =>
        prev.filter(plaza => {
          const timeElapsed = Date.now() - new Date(plaza.timestamp).getTime()
          return timeElapsed < 3000
        })
      )
    }, 3000)

    return () => clearTimeout(timeout)
  }, [plazasActualizadas.length])

  // Función para emitir un evento personalizado
  const emitEvent = useCallback((event, data) => {
    return emitSocketEvent(event, data)
  }, [])

  const requestRefresh = useCallback(() => {
    // Limpiar actualizaciones pendientes
    setPlazasActualizadas([])
    // Emitir evento para solicitar estado actual
    emitEvent('parking:request-state', { parkingId })
  }, [emitEvent, parkingId])

  return {
    connected,
    plazasActualizadas,
    emitEvent,
    requestRefresh,
    clearUpdates: () => setPlazasActualizadas([])
  }
}

export default useSocketParking