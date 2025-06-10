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
  return Promise.resolve({
    users: [
      {
        id: 1,
        email: 'admin@appark.com',
        nombreCompleto: 'Administrador',
        telefono: '+34 600 000 000',
        rol: 'admin',
        fechaRegistro: new Date('2024-01-15'),
        activo: true,
        ultimoAcceso: new Date('2024-12-09')
      },
      {
        id: 2,
        email: 'usuario1@example.com',
        nombreCompleto: 'Juan Pérez',
        telefono: '+34 600 111 111',
        rol: 'user',
        fechaRegistro: new Date('2024-03-20'),
        activo: true,
        ultimoAcceso: new Date('2024-12-08')
      },
      {
        id: 3,
        email: 'usuario2@example.com',
        nombreCompleto: 'María García',
        telefono: '+34 600 222 222',
        rol: 'user',
        fechaRegistro: new Date('2024-05-10'),
        activo: false,
        ultimoAcceso: new Date('2024-11-15')
      }
    ]
  })
}

export const updateUserRole = async (userId, role) => {
  return Promise.resolve({ message: 'Rol actualizado correctamente' })
}

export const toggleUserStatus = async (userId) => {
  return Promise.resolve({ message: 'Estado del usuario actualizado' })
}

export const deleteUser = async (userId) => {
  return Promise.resolve({ message: 'Usuario eliminado correctamente' })
}
