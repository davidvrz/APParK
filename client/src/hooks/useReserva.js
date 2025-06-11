import { useEffect, useState, useCallback } from "react"
import {
  crearReserva,
  getReservasActivas,
  modificarReserva,
  cancelarReserva,
  eliminarReserva,
  getHistorialReservas
} from '@/api/reserva'

export const useReserva = () => {
  const [reservas, setReservas] = useState([])
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingHistorial, setLoadingHistorial] = useState(true)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const fetchReservas = useCallback(async () => {
    setLoading(true)
    clearError()
    try {
      const { reservas } = await getReservasActivas()
      setReservas(reservas || [])
    } catch (err) {
      console.error("Error al obtener reservas activas", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchHistorial = useCallback(async () => {
    setLoadingHistorial(true)
    clearError()
    try {
      const { historial } = await getHistorialReservas()
      setHistorial(historial || [])
    } catch (err) {
      console.error("Error al obtener historial", err)
      setError(err.message)
    } finally {
      setLoadingHistorial(false)
    }
  }, [])

  const crear = async (data) => {
    clearError()
    try {
      const res = await crearReserva(data)
      await fetchReservas()
      return res
    } catch (err) {
      console.error("Error al crear reserva", err)
      setError(err.message)
      throw err
    }
  }

  const modificar = async (id, data) => {
    clearError()
    try {
      const res = await modificarReserva(id, data)
      await fetchReservas()
      return res
    } catch (err) {
      console.error("Error al modificar reserva", err)
      setError(err.message)
      throw err
    }
  }

  const cancelar = async (id) => {
    clearError()
    try {
      const res = await cancelarReserva(id)
      await fetchReservas()
      return res
    } catch (err) {
      console.error("Error al cancelar reserva", err)
      setError(err.message)
      throw err
    }
  }

  const eliminar = async (id) => {
    clearError()
    try {
      const res = await eliminarReserva(id)
      await fetchReservas()
      return res
    } catch (err) {
      console.error("Error al eliminar reserva", err)
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchReservas()
    fetchHistorial() // Cargamos también el historial al inicializar el componente
  }, [fetchReservas, fetchHistorial])

  return {
    reservas,
    historial,
    loading,
    loadingHistorial,
    error,
    clearError,
    crearReserva: crear,
    modificarReserva: modificar,
    cancelarReserva: cancelar,
    eliminarReserva: eliminar,
    fetchReservas,
    fetchHistorial
  }
}
