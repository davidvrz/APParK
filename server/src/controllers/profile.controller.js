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
        attributes: ['id', 'matricula', 'modelo', 'tipo']
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

export const getUserVehicles = async (req, res) => {
  try {
    const { id: userId } = req.user
    const vehicles = await Vehicle.findAll({
      where: { usuario_id: userId },
      attributes: ['id', 'matricula', 'modelo', 'tipo']
    })

    res.status(200).json({ vehicles })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const addVehicle = async (req, res) => {
  try {
    const { matricula, modelo, tipo } = req.body
    const { id: userId } = req.user

    // Validaciones manuales
    if (!matricula || matricula.trim() === '') {
      return res.status(400).json({ error: 'La matrícula es obligatoria' })
    }

    if (!tipo || tipo.trim() === '') {
      return res.status(400).json({ error: 'El tipo de vehículo es obligatorio' })
    }

    // Normalizar matrícula (mayúsculas y sin espacios)
    const normalizedMatricula = matricula.trim().toUpperCase()

    // Validar formato de matrícula (longitud y regex)
    if (normalizedMatricula.length < 7 || normalizedMatricula.length > 10) {
      return res.status(400).json({ error: 'La matrícula debe tener entre 7 y 10 caracteres' })
    }
    if (!/^[A-Z0-9]+$/.test(normalizedMatricula)) {
      return res.status(400).json({ error: 'Formato de matrícula inválido. Use solo letras mayúsculas y números.' })
    }

    // Verificar si la matrícula ya existe
    const existingVehicle = await Vehicle.findOne({
      where: { matricula: normalizedMatricula }
    })

    if (existingVehicle) {
      return res.status(400).json({ error: 'Esta matrícula ya está registrada en el sistema' })
    }

    const vehicle = await Vehicle.create({
      matricula: normalizedMatricula,
      modelo: modelo?.trim() || '',
      tipo,
      usuario_id: userId
    })

    const createdVehicle = pick(vehicle.get(), ['id', 'matricula', 'modelo', 'tipo'])

    res.status(201).json({ vehicle: createdVehicle })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    res.status(500).json({ error: 'Error interno del servidor al añadir el vehículo' })
  }
}

export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params
    const { matricula, modelo, tipo } = req.body
    const { id: userId } = req.user

    const vehicle = await Vehicle.findOne({
      where: { id, usuario_id: userId }
    })

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehículo no encontrado' })
    }

    // Validaciones manuales si se está actualizando
    if (matricula !== undefined) {
      if (!matricula || matricula.trim() === '') {
        return res.status(400).json({ error: 'La matrícula es obligatoria' })
      }

      // Normalizar matrícula
      const normalizedMatricula = matricula.trim().toUpperCase()

      // Validar formato de matrícula (longitud y regex)
      if (normalizedMatricula.length < 7 || normalizedMatricula.length > 10) {
        return res.status(400).json({ error: 'La matrícula debe tener entre 7 y 10 caracteres' })
      }
      if (!/^[A-Z0-9]+$/.test(normalizedMatricula)) {
        return res.status(400).json({ error: 'Formato de matrícula inválido. Use solo letras mayúsculas y números.' })
      }

      // Verificar si la matrícula ya existe (excepto si es la misma del vehículo actual)
      if (normalizedMatricula !== vehicle.matricula) {
        const existingVehicle = await Vehicle.findOne({
          where: { matricula: normalizedMatricula }
        })

        if (existingVehicle) {
          return res.status(400).json({ error: 'Esta matrícula ya está registrada en el sistema' })
        }
      }

      vehicle.matricula = normalizedMatricula
    }

    if (tipo !== undefined) {
      if (!tipo || tipo.trim() === '') {
        return res.status(400).json({ error: 'El tipo de vehículo es obligatorio' })
      }
      vehicle.tipo = tipo
    }

    if (modelo !== undefined) {
      vehicle.modelo = modelo?.trim() || ''
    }

    await vehicle.save()

    const updatedVehicle = pick(vehicle.get(), ['id', 'matricula', 'modelo', 'tipo'])

    res.status(200).json({ message: 'Vehículo actualizado correctamente', vehicle: updatedVehicle })
  } catch (error) {
    console.error('Error updating vehicle:', error)
    res.status(500).json({ error: 'Error interno del servidor al actualizar el vehículo' })
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

    await Vehicle.destroy({ where: { usuario_id: userId } })

    const deleted = await User.destroy({ where: { id: userId } })

    if (!deleted) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

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
