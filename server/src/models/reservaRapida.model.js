import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'
import Plaza from './plaza.model.js'

const ReservaRapida = sequelize.define('ReservaRapida', {
  matricula: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
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
  }
}, {
  tableName: 'ReservaRapida',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

ReservaRapida.belongsTo(Plaza, { foreignKey: 'plaza_id', as: 'plaza' })
Plaza.hasMany(ReservaRapida, { foreignKey: 'plaza_id', as: 'reservasRapidas' })

export default ReservaRapida
