import { useEffect, useState, useCallback } from 'react'
import {
  getProfile,
  updateProfile,
  deleteAccount,
  getAllUsers,
  updateUserRole,
  toggleUserStatus,
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

  // ============= ADMIN USER MANAGEMENT =============

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    clearError()
    try {
      const data = await getAllUsers()
      setUsers(data.users || [])
    } catch (err) {
      console.error('Error al obtener usuarios:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleUpdateUserRole = useCallback(async (userId, newRole) => {
    clearError()
    try {
      const res = await updateUserRole(userId, newRole)
      await fetchUsers() // Refresh users list
      return res
    } catch (err) {
      console.error('Error al actualizar rol:', err)
      setError(err.message)
      throw err
    }
  }, [fetchUsers])

  const handleToggleUserStatus = useCallback(async (userId) => {
    clearError()
    try {
      const res = await toggleUserStatus(userId)
      await fetchUsers() // Refresh users list
      return res
    } catch (err) {
      console.error('Error al cambiar estado:', err)
      setError(err.message)
      throw err
    }
  }, [fetchUsers])

  const handleDeleteUser = useCallback(async (userId) => {
    clearError()
    try {
      const res = await deleteUser(userId)
      await fetchUsers() // Refresh users list
      return res
    } catch (err) {
      console.error('Error al eliminar usuario:', err)
      setError(err.message)
      throw err
    }
  }, [fetchUsers])

  useEffect(() => {
    fetchPerfil()
    fetchUsers()  // Auto-fetch users for admin components
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
    updateUserRole: handleUpdateUserRole,
    toggleUserStatus: handleToggleUserStatus,
    deleteUser: handleDeleteUser,
  }
}
