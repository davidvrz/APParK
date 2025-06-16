import axios from './axios'

export const getProfile = async () => {
  const res = await axios.get('/profile')
  return res.data
}

export const getUserVehicles = async () => {
  const res = await axios.get('/profile/vehicles')
  return res.data
}

export const updateProfile = async (data) => {
  const res = await axios.put('/profile', data)
  return res.data
}

export const deleteAccount = async () => {
  const res = await axios.delete('/profile')
  return res.data
}

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

export const getAllUsers = async () => {
  const res = await axios.get('/profile/admin/users')
  return res.data
}

export const deleteUser = async (userId) => {
  const res = await axios.delete(`/profile/admin/users/${userId}`)
  return res.data
}
