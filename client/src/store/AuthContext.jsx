import { createContext, useState, useEffect, useCallback } from 'react'
import { jwtDecode } from 'jwt-decode'
import { loginUser, registerUser, logoutUser, refreshToken } from "@/api/auth"
import { setAccessToken as syncAxiosToken } from '@/api/axios.js'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessTokenState, setAccessTokenState] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isAuthChecked, setIsAuthChecked] = useState(false) // clave para evitar redirecciones antes de tiempo

  const clearError = () => setError(null)

  // Al montar, intentamos recuperar token del localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken')

    if (token) {
      try {
        const decoded = jwtDecode(token)

        if (decoded.exp * 1000 > Date.now()) {
        // Token válido
          setUser({
            id: decoded.id,
            email: decoded.email,
            rol: decoded.rol,
            nombreCompleto: decoded.nombreCompleto
          })
          setAccessTokenState(token)
          syncAxiosToken(token)
          clearError()
          setIsAuthChecked(true)
        } else {
        // Token expirado
          console.log('Token expirado, eliminando...')
          localStorage.removeItem('accessToken')
          attemptTokenRefresh()
        }
      } catch (_err) {
        console.error('Token inválido, eliminando...', _err)
        localStorage.removeItem('accessToken')
        attemptTokenRefresh()
      }
    } else {
      attemptTokenRefresh()
    }
  }, [])

  const attemptTokenRefresh = () => {
    const hasRefreshCookie = document.cookie.includes('refreshToken')

    if (hasRefreshCookie) {
      refreshToken()
        .then(res => {
          const { token } = res.data.accessToken
          const decoded = jwtDecode(token)

          setAccessTokenState(token)
          syncAxiosToken(token)
          localStorage.setItem('accessToken', token)
          setUser({
            id: decoded.id,
            email: decoded.email,
            rol: decoded.rol,
            nombreCompleto: decoded.nombreCompleto
          })
        })
        .catch(err => {
          console.warn('No se pudo renovar el token:', err.message)
        })
        .finally(() => {
          setIsAuthChecked(true)
        })
    } else {
      setIsAuthChecked(true)
    }
  }

  // Usamos useCallback para evitar dependencias circulares en useEffect
  const logout = useCallback(async () => {
    setLoading(true)
    clearError()
    try {
      await logoutUser()
    } catch (_err) {
      console.error("Error al cerrar sesión:", _err)
      setError(_err.message)
    } finally {
      localStorage.removeItem('accessToken')
      setAccessTokenState(null)
      syncAxiosToken(null)
      setUser(null)
      setLoading(false)
    }
  }, [])

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
    } catch (_err) {
      console.error("Error al iniciar sesión:", _err)
      setError(_err.message)
      return {
        ok: false,
        error: _err.message
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
    } catch (_err) {
      console.error("Error al registrarse:", _err)
      setError(_err.message)
      return {
        ok: false,
        error: _err.message
      }
    } finally {
      setLoading(false)
    }
  }

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
      } catch (_err) {
        setError('Error al decodificar token')
        logout()
      }
    }
  }, [accessTokenState, logout])

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken: accessTokenState,
        isAuthenticated: !!user,
        isAuthChecked,
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
