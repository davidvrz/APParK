import axios from './axios'

export const crearReserva = async (datos) => {
  const response = await axios.post('/reserva', datos)
  return response.data
}

export const getReservasActivas = async () => {
  const response = await axios.get('/reserva')
  return response.data
}

export const modificarReserva = async (reservaId, datos) => {
  const response = await axios.put(`/reserva/${reservaId}`, datos)
  return response.data
}

export const cancelarReserva = async (reservaId) => {
  const response = await axios.patch(`/reserva/${reservaId}`)
  return response.data
}

export const eliminarReserva = async (reservaId) => {
  const response = await axios.delete(`/reserva/${reservaId}`)
  return response.data
}

export const getHistorialReservas = async () => {
  const response = await axios.get('/reserva/historial')
  return response.data
}
