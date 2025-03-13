import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nombreCompleto: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'nombre_completo'
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rol: {
    type: DataTypes.ENUM('admin', 'conductor'),
    allowNull: false
  }
}, {
  tableName: 'Usuario',
  timestamps: false // 👈 Desactiva los timestamps automáticos de Sequelize
})

export default User
