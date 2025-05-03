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
      console.log('📡 Actualización recibida:', data)
      if (data && data.plazaId) {
        setPlazasActualizadas(prev => [
          ...prev,
          {
            id: data.plazaId,
            estado: data.nuevoEstado,
            timestamp: new Date(),
            tipo: data.tipo
          }
        ])
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

  // Función para actualizar estados localmente en una plaza
  const actualizarEstadoPlaza = useCallback((plazaId, nuevoEstado, plantas) => {
    if (!plantas) return plantas

    return plantas.map(planta => ({
      ...planta,
      plazas: planta.plazas.map(plaza =>
        plaza.id === plazaId ? { ...plaza, estado: nuevoEstado } : plaza
      )
    }))
  }, [])

  // Función para emitir un evento personalizado
  const emitEvent = useCallback((event, data) => {
    return emitSocketEvent(event, data)
  }, [])

  return {
    connected,
    plazasActualizadas,
    actualizarEstadoPlaza,
    emitEvent,
    clearUpdates: () => setPlazasActualizadas([])
  }
}

export default useSocketParking