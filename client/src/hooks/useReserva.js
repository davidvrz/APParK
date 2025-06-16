import { useEffect, useState, useCallback } from "react"
import {
  crearReserva,
  getReservasActivas,
  modificarReserva,
  cancelarReserva,
  eliminarReserva,
  getHistorialReservas,
  getReservasParking,
  getReservasRapidasParking,
  crearReservaRapida,
  completeReservaRapida
} from '@/api/reserva'

export const useReserva = () => {
  const [reservas, setReservas] = useState([])
  const [historial, setHistorial] = useState([])
  const [reservasParking, setReservasParking] = useState([])
  const [reservasRapidas, setReservasRapidas] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingHistorial, setLoadingHistorial] = useState(true)
  const [loadingParking, setLoadingParking] = useState(false)
  const [loadingRapidas, setLoadingRapidas] = useState(false)
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

  const fetchReservasParking = useCallback(async (parkingId) => {
    if (!parkingId) return []

    setLoadingParking(true)
    clearError()
    try {
      const { reservas } = await getReservasParking(parkingId)
      setReservasParking(reservas || [])
      return reservas || []
    } catch (err) {
      console.error("Error al obtener reservas del parking", err)
      setError(err.message)
      return []
    } finally {
      setLoadingParking(false)
    }
  }, [])

  const fetchReservasRapidasParking = useCallback(async (parkingId) => {
    if (!parkingId) return []

    setLoadingRapidas(true)
    clearError()
    try {
      const { reservasRapidas } = await getReservasRapidasParking(parkingId)
      setReservasRapidas(reservasRapidas || [])
      return reservasRapidas || []
    } catch (err) {
      console.error("Error al obtener reservas rápidas del parking", err)
      setError(err.message)
      return []
    } finally {
      setLoadingRapidas(false)
    }
  }, [])

  // Funciones para contar reservas por plaza
  const getReservasPorPlaza = useCallback((plazaId) => {
    return reservasParking.filter(r => r.plaza.id === plazaId)
  }, [reservasParking])

  const getReservasEstaSemana = useCallback((plazaId) => {
    const ahora = new Date()
    const inicioSemana = new Date(ahora)
    inicioSemana.setDate(ahora.getDate() - ahora.getDay()) // Lunes
    const finSemana = new Date(inicioSemana)
    finSemana.setDate(inicioSemana.getDate() + 7)

    return reservasParking.filter(r =>
      r.plaza.id === plazaId &&
      new Date(r.startTime) >= inicioSemana &&
      new Date(r.startTime) < finSemana
    )
  }, [reservasParking])

  const getProximasReservas = useCallback((plazaId, limite = 5) => {
    const ahora = new Date()
    return reservasParking
      .filter(r => r.plaza.id === plazaId && new Date(r.startTime) > ahora)
      .slice(0, limite)
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
  }, [reservasParking])

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

  const completarReservaRapida = useCallback(async (parkingId) => {
    clearError()
    try {
      const { reserva } = await completeReservaRapida(parkingId)
      await fetchReservasRapidasParking(parkingId)
      return reserva
    } catch (err) {
      console.error("Error al completar reserva rápida", err)
      setError(err.message)
      throw err
    }
  }, [fetchReservasRapidasParking])

  const crearReservaRapida = useCallback(async (parkingId, data) => {
    clearError()
    try {
      const { reserva } = await crearReservaRapida(parkingId, data)
      await fetchReservasRapidasParking(parkingId)
      return reserva
    } catch (err) {
      console.error("Error al crear reserva rápida", err)
      setError(err.message)
      throw err
    }
  }, [fetchReservasRapidasParking])

  useEffect(() => {
    fetchReservas()
    fetchHistorial()
  }, [fetchReservas, fetchHistorial])
  return {
    reservas,
    historial,
    reservasParking,
    reservasRapidas,
    loading,
    loadingHistorial,
    loadingParking,
    loadingRapidas,
    error,
    clearError,
    crearReserva: crear,
    modificarReserva: modificar,
    cancelarReserva: cancelar,
    eliminarReserva: eliminar,
    fetchReservas,
    fetchHistorial,
    fetchReservasParking,
    getReservasPorPlaza,
    getReservasEstaSemana,
    getProximasReservas,
    fetchReservasRapidasParking,
    completarReservaRapida,
    crearReservaRapida
  }
}
