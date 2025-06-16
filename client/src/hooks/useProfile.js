import { useEffect, useState, useCallback } from 'react'
import {
  getProfile,
  updateProfile,
  deleteAccount,
  getAllUsers,
  deleteUser
} from '@/api/profile'

export const useProfile = () => {
  const [perfil, setPerfil] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const clearError = () => setError(null)

  const fetchPerfil = useCallback(async () => {
    setLoading(true)
    clearError()
    try {
      const { profile } = await getProfile()
      setPerfil(profile || null)
    } catch (err) {
      console.error('Error al obtener perfil:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const actualizarPerfil = async (data) => {
    clearError()
    try {
      const res = await updateProfile(data)
      await fetchPerfil()
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

  // Admin

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    clearError()
    try {
      const { users } = await getAllUsers()
      setUsers(users || [])
    } catch (err) {
      console.error('Error al obtener usuarios:', err)
      setError(err.response?.data?.error || 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleDeleteUser = useCallback(async (userId) => {
    clearError()
    try {
      const res = await deleteUser(userId)
      await fetchUsers()
      return res
    } catch (err) {
      console.error('Error al eliminar usuario:', err)
      setError(err.response?.data?.error || 'Error desconocido')
      throw err
    }
  }, [fetchUsers])

  useEffect(() => {
    fetchPerfil()
    fetchUsers()
  }, [fetchPerfil, fetchUsers])

  return {
    // Profile state
    perfil,
    loading,
    error,

    // Users state (for admin)
    users,

    // Utilities
    clearError,

    // Profile operations
    actualizarPerfil,
    eliminarCuenta,
    fetchPerfil,

    // Admin user operations
    fetchUsers,
    deleteUser: handleDeleteUser,
  }
}
