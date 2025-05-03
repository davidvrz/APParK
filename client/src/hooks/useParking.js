import { useState, useEffect, useCallback } from 'react'
import {
  getAllParkings,
  getParkingById,
  getPlantaById,
  getPlazaById,
  getAnunciosByParkingId
} from '@/api/parking'

export const useParking = (parkingId = null) => {
  const [parkings, setParkings] = useState([])
  const [parking, setParking] = useState(null)
  const [anuncios, setAnuncios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const fetchParkings = useCallback(async () => {
    setLoading(true)
    clearError()
    try {
      const { parkings } = await getAllParkings()
      setParkings(parkings || [])
    } catch (err) {
      console.error('Error al obtener parkings:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchParkingById = useCallback(async (id) => {
    if (!id) return null
    clearError()
    setLoading(true)
    try {
      const { parking } = await getParkingById(id)
      setParking(parking)
      return parking
    } catch (err) {
      console.error('Error al obtener parking por ID:', err)
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAnuncios =  useCallback(async (id) => {
    if (!id) return []
    try {
      const { anuncios } = await getAnunciosByParkingId(id)
      setAnuncios(anuncios || [])
      return anuncios
    } catch (err) {
      console.error('Error al obtener anuncios del parking:', err)
      return []
    }
  }, [])

  const fetchPlantaById = async (parkingId, plantaId) => {
    clearError()
    try {
      const { planta } = await getPlantaById(parkingId, plantaId)
      return planta
    } catch (err) {
      console.error('Error al obtener planta:', err)
      setError(err.message)
      throw err
    }
  }

  const fetchPlazaById = async (parkingId, plantaId, plazaId) => {
    clearError()
    try {
      const { plaza } = await getPlazaById(parkingId, plantaId, plazaId)
      return plaza
    } catch (err) {
      console.error('Error al obtener plaza:', err)
      setError(err.message)
      throw err
    }
  }

  // Cargar el parking específico cuando se proporciona un ID
  useEffect(() => {
    if (parkingId) {
      fetchParkingById(parkingId)
    }
  }, [parkingId, fetchParkingById])

  return {
    parkings,
    parking,
    anuncios,
    loading,
    error,
    clearError,
    fetchParkings,
    fetchParkingById,
    fetchAnuncios,
    fetchPlantaById,
    fetchPlazaById
  }
}
