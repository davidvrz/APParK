import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { sequelize } from '../database/db.js'

const createAdminUser = async () => {
  try {
    // Sincroniza los modelos para asegurarse de que la tabla de usuarios exista
    await sequelize.sync()

    const adminEmail = 'admin@appark.com'
    const adminPassword = 'admin123'

    const existingAdmin = await User.findOne({ where: { email: adminEmail } })

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10)
      await User.create({
        email: adminEmail,
        hashedPassword, // Corregido de password_hash a hashedPassword
        nombreCompleto: 'Administrador',
        rol: 'admin'
      })
      console.log('Usuario administrador creado con éxito.')
    } else {
      console.log('El usuario administrador ya existe.')
    }
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error)
    process.exit(1) // Salir con error si algo falla
  } finally {
    await sequelize.close() // Cerrar la conexión
  }
}

createAdminUser()
