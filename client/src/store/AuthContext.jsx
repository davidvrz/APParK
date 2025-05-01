import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { loginUser, registerUser, logoutUser } from "@/api/auth"
import axios, { setAccessToken as syncAxiosToken } from '@/api/axios.js'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessTokenState, setAccessTokenState] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const clearError = () => setError(null)

  // Podriamos hacer una peticion a la API para obtener el usuario
  // Al montar, intentamos recuperar token del localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser({
          id: decoded.id,
          email: decoded.email,
          rol: decoded.rol,
          nombreCompleto: decoded.nombreCompleto
        })
        setAccessTokenState(token)
        syncAxiosToken(token) 
        clearError()
      } catch (err) {
        console.error('Token inválido, eliminando...', err)
        setError('Sesión expirada o inválida')
        localStorage.removeItem('accessToken')
      }
    }
  }, [])

  // Si el accessToken cambia, actualizamos usuario
  useEffect(() => {
    if (accessTokenState) {
      try {
        const decoded = jwtDecode(accessTokenState)
        setUser({
          id: decoded.id,
          email: decoded.email,
          rol: decoded.rol,
          nombreCompleto: decoded.nombreCompleto
        })
        clearError()
      } catch (err) {
        setError('Error al decodificar token')
        logout()
      }
    }
  }, [accessTokenState])

  const login = async (email, password) => {    
    setLoading(true)
    clearError()
    try {
      const res = await loginUser(email, password)
      const { token } = res.data.accessToken
      const decoded = jwtDecode(token)

      localStorage.setItem('accessToken', token)
      syncAxiosToken(token)
      setAccessTokenState(token)
      setUser({
        id: decoded.id,
        email: decoded.email,
        rol: decoded.rol,
        nombreCompleto: decoded.nombreCompleto
      })

      return { ok: true }
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      setError(err.message)
      return {
        ok: false,
        error: err.message
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (nombre, email, password) => {
    setLoading(true)
    clearError()
    try {
      await registerUser(nombre, email, password)
      return await login(email, password)
    } catch (err) {
      console.error("Error al registrarse:", err)
      setError(err.message)
      return {
        ok: false,
        error: err.message
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    clearError()
    try {
      await logoutUser()
    } catch (err) {
      console.error("Error al cerrar sesión:", err)
      setError(err.message)
    } finally {
      localStorage.removeItem('accessToken')
      setAccessTokenState(null)
      syncAxiosToken(null)
      setUser(null)
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: accessTokenState,
        isAuthenticated: !!user,
        loading,
        error,
        clearError,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
