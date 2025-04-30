import axios from './axios'

// POST /reserva → crear nueva reserva
export const crearReserva = async (datos) => {
  const response = await axios.post('/reserva', datos)
  return response.data
}

// GET /reserva → obtener reservas activas
export const getReservasActivas = async () => {
  const response = await axios.get('/reserva')
  return response.data
}

// PUT /reserva/:reservaId → modificar reserva existente
export const modificarReserva = async (reservaId, datos) => {
  const response = await axios.put(`/reserva/${reservaId}`, datos)
  return response.data
}

// PATCH /reserva/:reservaId → cancelar reserva
export const cancelarReserva = async (reservaId) => {
  const response = await axios.patch(`/reserva/${reservaId}`)
  return response.data
}

// DELETE /reserva/:reservaId → eliminar reserva (admin)
export const eliminarReserva = async (reservaId) => {
  const response = await axios.delete(`/reserva/${reservaId}`)
  return response.data
}

// GET /reserva/historial → historial del usuario
export const getHistorialReservas = async () => {
  const response = await axios.get('/reserva/historial')
  return response.data
}
