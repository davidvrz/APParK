import axios from './axios'

export const addVehicle = async (data) => {
  const res = await axios.post('/profile/vehicle', data)
  return res.data
}

export const updateVehicle = async (id, data) => {
  const res = await axios.put(`/profile/vehicle/${id}`, data)
  return res.data
}

export const deleteVehicle = async (id) => {
  const res = await axios.delete(`/profile/vehicle/${id}`)
  return res.data
}
