import { useState, useEffect, useCallback } from 'react'
import {
  initSocket,
  joinParkingRoom,
  leaveParkingRoom,
  onSocketEvent,
  offSocketEvent
} from '@/sockets/socketClient'

export const useSocketEventos = (parkingIds = []) => {
  const [connected, setConnected] = useState(false)
  const [eventosEnTiempoReal, setEventosEnTiempoReal] = useState([])

  const connectToSocket = useCallback(() => {
    const socket = initSocket()

    const onConnect = () => {
      setConnected(true)
      parkingIds.forEach(parkingId => {
        if (parkingId) {
          joinParkingRoom(parkingId)
        }
      })
    }

    const onDisconnect = () => {
      setConnected(false)
    }

    const onEventoRegistrado = (data) => {
      console.log('📡 Nuevo evento recibido:', data)

      if (data && data.plazaId) {
        const nuevoEvento = {
          id: `temp-${Date.now()}`, // ID temporal hasta que se refresque desde BD
          plazaId: data.plazaId,
          matricula: data.matricula,
          tipoEvento: data.tipoEvento,
          mensaje: data.mensaje,
          fecha: data.fecha || new Date().toISOString(),
          isNew: true, // Marcar como nuevo para animaciones
          timestamp: new Date()
        }

        setEventosEnTiempoReal(prev => [nuevoEvento, ...prev])
      }
    }

    onSocketEvent('connect', onConnect)
    onSocketEvent('disconnect', onDisconnect)
    onSocketEvent('evento:registrado', onEventoRegistrado)

    // Verificar si ya está conectado inicialmente
    if (socket && socket.connected) {
      onConnect()
    }

    // Cleanup al desmontar
    return () => {
      // Salir de todas las salas
      parkingIds.forEach(parkingId => {
        if (parkingId) {
          leaveParkingRoom(parkingId)
        }
      })

      offSocketEvent('connect', onConnect)
      offSocketEvent('disconnect', onDisconnect)
      offSocketEvent('evento:registrado', onEventoRegistrado)
    }
  }, [parkingIds])

  // Conectar/desconectar cuando cambian los parkingIds
  useEffect(() => {
    if (parkingIds.length > 0) {
      const cleanup = connectToSocket()
      return cleanup
    }
  }, [connectToSocket, parkingIds.length])

  // Actualizar salas cuando cambian los parkingIds
  useEffect(() => {
    if (connected && parkingIds.length > 0) {
      parkingIds.forEach(parkingId => {
        if (parkingId) {
          joinParkingRoom(parkingId)
        }
      })
    }
  }, [parkingIds, connected])

  return {
    connected,
    eventosEnTiempoReal,
    clearEventosEnTiempoReal: () => setEventosEnTiempoReal([]),
    updateEventoEnTiempoReal: (updater) => setEventosEnTiempoReal(updater)
  }
}

export default useSocketEventos
