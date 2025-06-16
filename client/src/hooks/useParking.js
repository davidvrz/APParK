import { useState, useEffect, useCallback } from 'react'
import {
  getAllParkings,
  getParkingById,
  getPlantaById,
  getPlazaById,
  getAnunciosByParkingId,
  createParking,
  updateParking,
  deleteParking,
  createPlanta,
  deletePlanta,
  createPlaza,
  updatePlaza,
  deletePlaza,
  createAnuncio,
  updateAnuncio,
  deleteAnuncio
} from '@/api/parking'

export const useParking = (parkingId = null) => {  const [parkings, setParkings] = useState([])
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
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAnuncios = useCallback(async (id) => {
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

  // Admin

  const handleCreateParking = useCallback(async (data) => {
    clearError()
    try {
      const { parking } = await createParking(data)
      await fetchParkings()
      return parking
    } catch (err) {
      console.error('Error al crear parking:', err)
      setError(err.message)
      throw err
    }
  }, [fetchParkings])

  const handleUpdateParking = useCallback(async (id, data) => {
    clearError()
    try {
      const { parking } = await updateParking(id, data)
      await fetchParkings()
      if (parking && parking.id === id) {
        await fetchParkingById(id)
      }
      return parking
    } catch (err) {
      console.error('Error al actualizar parking:', err)
      setError(err.message)
      throw err
    }
  }, [fetchParkings, fetchParkingById])

  const handleDeleteParking = useCallback(async (id) => {
    clearError()
    try {
      const { message } = await deleteParking(id)
      await fetchParkings()
      if (parking && parking.id === id) {
        setParking(null)
      }
      return message
    } catch (err) {
      console.error('Error al eliminar parking:', err)
      setError(err.message)
      throw err
    }
  }, [fetchParkings, parking])

  const handleCreatePlanta = useCallback(async (parkingId, data) => {
    clearError()
    try {
      const { planta } = await createPlanta(parkingId, data)
      if (parking && parking.id === parkingId) {
        await fetchParkingById(parkingId)
      }
      return planta
    } catch (err) {
      console.error('Error al crear planta:', err)
      setError(err.message)
      throw err
    }
  }, [parking, fetchParkingById])

  const handleDeletePlanta = useCallback(async (parkingId, plantaId) => {
    clearError()
    try {
      const { message } = await deletePlanta(parkingId, plantaId)
      if (parking && parking.id === parkingId) {
        await fetchParkingById(parkingId)
      }
      return message
    } catch (err) {
      console.error('Error al eliminar planta:', err)
      setError(err.message)
      throw err
    }
  }, [parking, fetchParkingById])

  const handleCreatePlaza = useCallback(async (parkingId, plantaId, data) => {
    clearError()
    try {
      const { plaza } = await createPlaza(parkingId, plantaId, data)
      if (parking && parking.id === parkingId) {
        await fetchParkingById(parkingId)
      }
      return plaza
    } catch (err) {
      console.error('Error al crear plaza:', err)
      setError(err.message)
      throw err
    }
  }, [parking, fetchParkingById])

  const handleUpdatePlaza = useCallback(async (parkingId, plantaId, plazaId, data) => {
    clearError()
    try {
      const { plaza } = await updatePlaza(parkingId, plantaId, plazaId, data)
      if (parking && parking.id === parkingId) {
        await fetchParkingById(parkingId)
      }
      return plaza
    } catch (err) {
      console.error('Error al actualizar plaza:', err)
      setError(err.message)
      throw err
    }
  }, [parking, fetchParkingById])

  const handleDeletePlaza = useCallback(async (parkingId, plantaId, plazaId) => {
    clearError()
    try {
      const { message } = await deletePlaza(parkingId, plantaId, plazaId)
      if (parking && parking.id === parkingId) {
        await fetchParkingById(parkingId)
      }
      return message
    } catch (err) {
      console.error('Error al eliminar plaza:', err)
      setError(err.message)
      throw err
    }
  }, [parking, fetchParkingById])

  const handleCreateAnuncio = useCallback(async (parkingId, data) => {
    clearError()
    try {
      const { anuncio } = await createAnuncio(parkingId, data)
      await fetchAnuncios(parkingId)
      return anuncio
    } catch (err) {
      console.error('Error al crear anuncio:', err)
      setError(err.message)
      throw err
    }
  }, [fetchAnuncios])

  const handleUpdateAnuncio = useCallback(async (parkingId, anuncioId, data) => {
    clearError()
    try {
      const { anuncio } = await updateAnuncio(parkingId, anuncioId, data)
      await fetchAnuncios(parkingId)
      return anuncio
    } catch (err) {
      console.error('Error al actualizar anuncio:', err)
      setError(err.message)
      throw err
    }
  }, [fetchAnuncios])

  const handleDeleteAnuncio = useCallback(async (parkingId, anuncioId) => {
    clearError()
    try {
      const { message } = await deleteAnuncio(parkingId, anuncioId)
      await fetchAnuncios(parkingId)
      return message
    } catch (err) {
      console.error('Error al eliminar anuncio:', err)
      setError(err.message)
      throw err
    }
  }, [fetchAnuncios])

  useEffect(() => {
    fetchParkings()
  }, [fetchParkings])

  useEffect(() => {
    if (parkingId) {
      fetchParkingById(parkingId)
    }
  }, [parkingId, fetchParkingById])
  return {
    // State
    parkings,
    parking,
    anuncios,
    loading,
    error,

    // Utilities
    clearError,

    // Basic CRUD operations
    fetchParkings,
    fetchParkingById,
    fetchPlantaById,
    fetchPlazaById,
    fetchAnuncios,

    // Admin parking operations
    createParking: handleCreateParking,
    updateParking: handleUpdateParking,
    deleteParking: handleDeleteParking,

    // Admin planta operations
    createPlanta: handleCreatePlanta,
    deletePlanta: handleDeletePlanta,

    // Admin plaza operations
    createPlaza: handleCreatePlaza,
    updatePlaza: handleUpdatePlaza,
    deletePlaza: handleDeletePlaza,

    // Admin anuncio operations
    createAnuncio: handleCreateAnuncio,
    updateAnuncio: handleUpdateAnuncio,
    deleteAnuncio: handleDeleteAnuncio
  }
}
