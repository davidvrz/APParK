import User from '../models/user.model.js'
import Vehicle from '../models/vehicle.model.js'
import bcrypt from 'bcryptjs'
import pick from 'lodash/pick.js'

export const getProfile = async (req, res) => {
  try {
    const { id: userId } = req.user
    const user = await User.findByPk(userId, {
      attributes: ['email', 'nombreCompleto', 'telefono', 'rol'],
      include: [{
        model: Vehicle,
        as: 'vehicles',
        attributes: ['id', 'matricula', 'tipo']
      }]
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.status(200).json({ profile: user })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { id: userId } = req.user
    const { nombreCompleto, telefono, currentPassword, newPassword } = req.body

    const user = await User.findByPk(userId)
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    user.nombreCompleto = nombreCompleto ?? user.nombreCompleto
    user.telefono = telefono ?? user.telefono

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.hashedPassword)
      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña actual incorrecta' })
      }

      user.hashedPassword = await bcrypt.hash(newPassword, 10)
    }

    await user.save()

    const updatedProfile = pick(user.get(), ['id', 'email', 'nombreCompleto', 'telefono', 'rol'])

    res.status(200).json({ message: 'Perfil actualizado correctamente', profile: updatedProfile })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const addVehicle = async (req, res) => {
  try {
    const { matricula, tipo } = req.body
    const { id: userId } = req.user

    const vehicle = await Vehicle.create({
      matricula,
      tipo,
      usuario_id: userId
    })

    const createdVehicle = pick(vehicle.get(), ['id', 'matricula', 'tipo'])

    res.status(201).json({ vehicle: createdVehicle })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params
    const { matricula, tipo } = req.body
    const { id: userId } = req.user

    const vehicle = await Vehicle.findOne({
      where: { id, usuario_id: userId }
    })

    if (!vehicle) {
      return res.status(404).json({ error: 'Matrícula no encontrada' })
    }

    vehicle.matricula = matricula ?? vehicle.matricula
    vehicle.tipo = tipo ?? vehicle.tipo

    await vehicle.save()

    const updatedVehicle = pick(vehicle.get(), ['id', 'matricula', 'tipo'])

    res.status(200).json({ message: 'Vehículo actualizado correctamente', vehicle: updatedVehicle })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params
    const { id: userId } = req.user

    const vehicle = await Vehicle.findOne({
      where: { id, usuario_id: userId }
    })

    if (!vehicle) {
      return res.status(404).json({ error: 'Matrícula no encontrada' })
    }

    await vehicle.destroy()

    res.status(200).json({ message: 'Vehículo eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteAccount = async (req, res) => {
  try {
    const { id: userId } = req.user

    // Eliminar todos los vehículos asociados al usuario
    await Vehicle.destroy({ where: { usuario_id: userId } })

    // Eliminar la cuenta de usuario
    const deleted = await User.destroy({ where: { id: userId } })

    if (!deleted) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Eliminar la cookie de refresh token
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false, // CAMBIAR A true EN PRODUCCIÓN
      sameSite: 'Strict',
      path: '/api/auth/refresh'
    })

    res.status(200).json({ message: 'Cuenta eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
