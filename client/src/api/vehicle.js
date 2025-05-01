import axios from './axios'

// POST /profile/vehicle
export const addVehicle = async (data) => {
  const res = await axios.post('/profile/vehicle', data)
  return res.data
}

// PUT /profile/vehicle/:id
export const updateVehicle = async (id, data) => {
  const res = await axios.put(`/profile/vehicle/${id}`, data)
  return res.data
}

// DELETE /profile/vehicle/:id
export const deleteVehicle = async (id) => {
  const res = await axios.delete(`/profile/vehicle/${id}`)
  return res.data
}
