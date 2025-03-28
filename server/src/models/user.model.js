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
  timestamps: true, // Sequelize gestionará automáticamente createdAt y updatedAt
  createdAt: 'created_at', // Sequelize lo mapeará a created_at en la BD
  updatedAt: 'updated_at' // Sequelize lo mapeará a updated_at en la BD
})

User.hasMany(Vehicle, { foreignKey: 'usuario_id', as: 'vehicles' }) // Un usuario puede tener varios vehículos
Vehicle.belongsTo(User, { foreignKey: 'usuario_id', as: 'owner' }) // Un vehículo pertenece a un usuario

export default User
