import { useEffect, useState, useCallback } from 'react'
import { addVehicle, updateVehicle, deleteVehicle, getUserVehicles } from '@/api/profile'

export const useVehiculos = () => {
  const [vehiculos, setVehiculos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const fetchVehiculos = useCallback(async () => {
    setLoading(true)
    clearError()
    try {
      const response = await getUserVehicles()
      setVehiculos(response?.vehicles || [])
    } catch (err) {
      console.error('Error al obtener vehículos:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const añadirVehiculo = async (data) => {
    clearError()
    try {
      const res = await addVehicle(data)
      await fetchVehiculos()
      return res
    } catch (err) {
      console.error('Error al añadir vehículo:', err)
      setError(err.message)
      throw err
    }
  }

  const actualizarVehiculo = async (id, data) => {
    clearError()
    try {
      const res = await updateVehicle(id, data)
      await fetchVehiculos()
      return res
    } catch (err) {
      console.error('Error al actualizar vehículo:', err)
      setError(err.message)
      throw err
    }
  }

  const eliminarVehiculo = async (id) => {
    clearError()
    try {
      const res = await deleteVehicle(id)
      await fetchVehiculos()
      return res
    } catch (err) {
      console.error('Error al eliminar vehículo:', err)
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    fetchVehiculos()
  }, [fetchVehiculos])

  return {
    vehiculos,
    loading,
    error,
    clearError,
    añadirVehiculo,
    actualizarVehiculo,
    eliminarVehiculo,
    fetchVehiculos
  }
}
