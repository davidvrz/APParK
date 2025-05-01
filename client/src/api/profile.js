import axios from './axios'

// GET /profile
export const getProfile = async () => {
  const res = await axios.get('/profile')
  return res.data
}

// GET /profile/vehicles
export const getUserVehicles = async () => {
  const res = await axios.get('/profile/vehicles')
  return res.data
}

// PUT /profile
export const updateProfile = async (data) => {
  const res = await axios.put('/profile', data)
  return res.data
}

// DELETE /profile
export const deleteAccount = async () => {
  const res = await axios.delete('/profile')
  return res.data
}
