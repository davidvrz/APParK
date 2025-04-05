import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'
import Vehicle from './vehicle.model.js'

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  hashedPassword: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'password_hash'
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
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

// Relaciones

User.hasMany(Vehicle, { foreignKey: 'usuario_id', as: 'vehicles' })
Vehicle.belongsTo(User, { foreignKey: 'usuario_id', as: 'owner' })

export default User
