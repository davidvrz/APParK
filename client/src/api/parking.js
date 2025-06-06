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
export const createParking = (data) => axios.post('/parking', data)
export const updateParking = (id, data) => axios.put(`/parking/${id}`, data)
export const deleteParking = (id) => axios.delete(`/parking/${id}`)

export const createPlanta = (parkingId, data) => axios.post(`/parking/${parkingId}/plantas`, data)
export const deletePlanta = (parkingId, plantaId) => axios.delete(`/parking/${parkingId}/plantas/${plantaId}`)

export const createPlaza = (parkingId, plantaId, data) =>
  axios.post(`/parking/${parkingId}/plantas/${plantaId}/plazas`, data)
export const updatePlaza = (parkingId, plantaId, plazaId, data) =>
  axios.put(`/parking/${parkingId}/plantas/${plantaId}/plazas/${plazaId}`, data)
export const deletePlaza = (parkingId, plantaId, plazaId) =>
  axios.delete(`/parking/${parkingId}/plantas/${plantaId}/plazas/${plazaId}`)

export const createAnuncio = (parkingId, data) => axios.post(`/parking/${parkingId}/anuncios`, data)
export const updateAnuncio = (parkingId, anuncioId, data) => axios.put(`/parking/${parkingId}/anuncios/${anuncioId}`, data)
export const deleteAnuncio = (parkingId, anuncioId) => axios.delete(`/parking/${parkingId}/anuncios/${anuncioId}`)

export const getReservasParking = (parkingId) => axios.get(`/parking/${parkingId}/reservas`)
export const getReservasRapidasParking = (parkingId) => axios.get(`/parking/${parkingId}/rapidas`)
export const completeReservaRapida = (parkingId) => axios.patch(`/parking/${parkingId}/complete`)

export const getEventosByParkingId = (parkingId) => axios.get(`/parking/${parkingId}/eventos`)

// Sistema interno (token de parking)
export const enviarEventoSensor = (parkingId, evento) =>
  axios.post(`/parking/${parkingId}/sensor`, evento)

export const crearReservaRapida = (parkingId, data) =>
  axios.post(`/parking/${parkingId}/quick`, data)
