import { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from '../api/axios.js'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setUser({ id: decoded.id, email: decoded.email })
        setAccessToken(token)
      } catch (err) {
        console.error('Token inválido, eliminando...', err)
        localStorage.removeItem('accessToken')
      }
    }
  }, [])

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password })

      const token = res.data.accessToken.token
      const decoded = jwtDecode(token)

      localStorage.setItem('accessToken', token)
      setAccessToken(token)
      setUser({ id: decoded.id, email: decoded.email })

      return { ok: true }
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || 'Error al iniciar sesión'
      }
    }
  }

  const register = async (nombre, email, password) => {
    try {
      await axios.post('/auth/register', { nombre, email, password })
      return await login(email, password)
    } catch (err) {
      return {
        ok: false,
        error: err.response?.data?.message || 'Error al registrarse'
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/auth/logout')
    } catch (err) {
      console.error('Error al cerrar sesión', err)
    } finally {
      localStorage.removeItem('accessToken')
      setAccessToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
