import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'
import User from './user.model.js'
import Vehicle from './vehicle.model.js'
import Plaza from './plaza.model.js'

const Reserva = sequelize.define('Reserva', {
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'end_time'
  },
  estado: {
    type: DataTypes.ENUM('activa', 'completada', 'cancelada'),
    allowNull: false,
    defaultValue: 'activa'
  },
  precioTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'precio_total'
  },
  matricula: {
    type: DataTypes.STRING(10),
    allowNull: true
  }
}, {
  tableName: 'Reserva',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

Reserva.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
User.hasMany(Reserva, { foreignKey: 'user_id', as: 'reservas' })

Reserva.belongsTo(Vehicle, { foreignKey: 'vehiculo_id', as: 'vehicle' })
Vehicle.hasMany(Reserva, { foreignKey: 'vehiculo_id', as: 'reservas' })

Reserva.belongsTo(Plaza, { foreignKey: 'plaza_id', as: 'plaza' })
Plaza.hasMany(Reserva, { foreignKey: 'plaza_id', as: 'reservas' })

export default Reserva
