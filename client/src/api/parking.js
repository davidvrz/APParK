import axios from './axios'

// Accesibles para usuario autenticado
export const getAllParkings = async () => {
  const res = await axios.get('/parking')
  return res.data
}

export const getParkingById = async (parkingId) => {
  const res = await axios.get(`/parking/${parkingId}`)
  return res.data
}

export const getPlantaById = async (parkingId, plantaId) => {
  const res = await axios.get(`/parking/${parkingId}/plantas/${plantaId}`)
  return res.data
}

export const getPlazaById = async (parkingId, plantaId, plazaId) => {
  const res = await axios.get(`/parking/${parkingId}/plantas/${plantaId}/plazas/${plazaId}`)
  return res.data
}

export const getAnunciosByParkingId = async (parkingId) => {
  const res = await axios.get(`/parking/${parkingId}/anuncios`)
  return res.data
}

// Admin
export const createParking = async (data) => {
  const response = await axios.post('/parking', data)
  return response.data
}

export const updateParking = async (id, data) => {
  const response = await axios.put(`/parking/${id}`, data)
  return response.data
}

export const deleteParking = async (id) => {
  const response = await axios.delete(`/parking/${id}`)
  return response.data
}

export const createPlanta = async (parkingId, data) => {
  const response = await axios.post(`/parking/${parkingId}/plantas`, data)
  return response.data
}

export const deletePlanta = async (parkingId, plantaId) => {
  const response = await axios.delete(`/parking/${parkingId}/plantas/${plantaId}`)
  return response.data
}

export const createPlaza = async (parkingId, plantaId, data) => {
  const response = await axios.post(`/parking/${parkingId}/plantas/${plantaId}/plazas`, data)
  return response.data
}

export const updatePlaza = async (parkingId, plantaId, plazaId, data) => {
  const response = await axios.put(`/parking/${parkingId}/plantas/${plantaId}/plazas/${plazaId}`, data)
  return response.data
}

export const deletePlaza = async (parkingId, plantaId, plazaId) => {
  const response = await axios.delete(`/parking/${parkingId}/plantas/${plantaId}/plazas/${plazaId}`)
  return response.data
}

export const createAnuncio = async (parkingId, data) => {
  const response = await axios.post(`/parking/${parkingId}/anuncios`, data)
  return response.data
}

export const updateAnuncio = async (parkingId, anuncioId, data) => {
  const response = await axios.put(`/parking/${parkingId}/anuncios/${anuncioId}`, data)
  return response.data
}

export const deleteAnuncio = async (parkingId, anuncioId) => {
  const response = await axios.delete(`/parking/${parkingId}/anuncios/${anuncioId}`)
  return response.data
}

export const getEventosByParkingId = async (parkingId) => {
  const response = await axios.get(`/parking/${parkingId}/eventos`)
  return response.data
}

// Sistema interno (token de parking)
export const enviarEventoSensor = (parkingId, evento) =>
  axios.post(`/parking/${parkingId}/sensor`, evento)
