import { useEffect, useState } from 'react'
import { getProfile, updateProfile, deleteAccount } from '@/api/profile'

export const useProfile = () => {
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const refetchPerfil = async () => {
    setLoading(true)
    clearError()
    try {
      const { usuario } = await getProfile()
      setPerfil(usuario || null)
    } catch (err) {
      console.error('Error al obtener perfil:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const actualizarPerfil = async (data) => {
    clearError()
    try {
      const res = await updateProfile(data)
      await refetchPerfil()
      return res
    } catch (err) {
      console.error('Error al actualizar perfil:', err)
      setError(err.message)
      throw err
    }
  }

  const eliminarCuenta = async () => {
    clearError()
    try {
      const res = await deleteAccount()
      return res
    } catch (err) {
      console.error('Error al eliminar cuenta:', err)
      setError(err.message)
      throw err
    }
  }

  useEffect(() => {
    refetchPerfil()
  }, [])

  return {
    perfil,
    loading,
    error,
    clearError,
    actualizarPerfil,
    eliminarCuenta,
    refetchPerfil,
  }
}
