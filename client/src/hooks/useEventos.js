import { useState, useCallback } from 'react'
import { getEventosByParkingId } from '@/api/parking'

export const useEventos = () => {
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const fetchEventosByParking = useCallback(async (parkingId) => {
    if (!parkingId) return []
    clearError()
    try {
      const { eventos } = await getEventosByParkingId(parkingId)
      return eventos || []
    } catch (err) {
      console.error('Error al obtener eventos del parking:', err)
      setError(err.message)
      return []
    }
  }, [])

  const fetchAllEventos = useCallback(async (parkingIds) => {
    if (!parkingIds || parkingIds.length === 0) return []

    setLoading(true)
    clearError()

    try {
      const eventosPromises = parkingIds.map(async (parkingId) => {
        try {
          const eventos = await fetchEventosByParking(parkingId)
          return eventos
        } catch (error) {
          console.error(`Error loading eventos for parking ${parkingId}:`, error)
          return []
        }
      })

      const eventosArrays = await Promise.all(eventosPromises)
      const flattenedEventos = eventosArrays.flat()

      // Ordenar por fecha (más recientes primero)
      flattenedEventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

      setEventos(flattenedEventos)
      return flattenedEventos
    } catch (error) {
      console.error('Error loading eventos from all parkings:', error)
      setError(error.message)
      return []
    } finally {
      setLoading(false)
    }
  }, [fetchEventosByParking])

  return {
    eventos,
    loading,
    error,
    clearError,
    fetchEventosByParking,
    fetchAllEventos
  }
}
