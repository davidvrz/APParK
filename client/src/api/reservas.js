// API de reservas: funciones para interactuar con los endpoints relacionados con reservas
import axios from './axios';

// Obtener reservas activas del usuario
export const getReservasActivas = async () => {
  const response = await axios.get('/reserva');   
  return response.data;
};

// Obtener historial de reservas del usuario
export const getHistorialReservas = async () => {
  const response = await axios.get('/reserva/historial');
  return response.data;
};

// Crear una nueva reserva
export const crearReserva = async (datos) => {
  const response = await axios.post('/reserva', datos);
  return response.data;
};

// Cancelar una reserva existente
export const cancelarReserva = async (reservaId) => {
  const response = await axios.patch(`/reserva/${reservaId}`);
  return response.data;
};

// Modificar una reserva existente
export const modificarReserva = async (reservaId, datos) => {
  const response = await axios.put(`/reserva/${reservaId}`, datos);
  return response.data;
};

