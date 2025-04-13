import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'
import Planta from './planta.model.js'

const Parking = sequelize.define('Parking', {
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ubicacion: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Operativo', 'Cerrado', 'Mantenimiento'),
    allowNull: false,
    defaultValue: 'Operativo'
  }
}, {
  tableName: 'Parking',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

Parking.hasMany(Planta, { foreignKey: 'parking_id', as: 'plantas', onDelete: 'CASCADE' })
Planta.belongsTo(Parking, { foreignKey: 'parking_id', as: 'parking' })

export default Parking
