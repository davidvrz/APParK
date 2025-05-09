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
