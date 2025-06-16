import axios from './axios'

export const loginUser = (email, password) =>
  axios.post('/auth/login', { email, password })

export const registerUser = (nombre, email, password, telefono) =>
  axios.post('/auth/register', { email, password, nombreCompleto: nombre, telefono })

export const logoutUser = () =>
  axios.post('/auth/logout')

export const refreshToken = () =>
  axios.post('/auth/refresh', {}, { withCredentials: true })
