import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL

let accessToken = localStorage.getItem('accessToken') || null

export const setAccessToken = (token) => {
  accessToken = token
  localStorage.setItem('accessToken', token)
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // cookies para el refreshToken
})

// 👉 Interceptor: añadir Authorization en cada request
axiosInstance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 👉 Interceptor: si el token expira, renovamos con /auth/refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register')
    ) {
      originalRequest._retry = true
      try {
        const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {}, {
          withCredentials: true
        })

        const { token } = res.data.accessToken
        setAccessToken(token)

        originalRequest.headers.Authorization = `Bearer ${token}`
        return axiosInstance(originalRequest)
      } catch (refreshError) {
        // Logout forzado si no se puede renovar
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    if (error.response?.data?.error) {
      // Si el backend devuelve un objeto con la propiedad 'error', la extraemos
      error.message = error.response.data.error
    } else if (error.response?.data?.details) {
      // Para errores de validación que devuelven detalles
      error.message = error.response.data.details.map(detail => detail.message).join(', ')
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
