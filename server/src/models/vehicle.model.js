import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'

const Vehicle = sequelize.define('Vehicle', {
  matricula: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: [7, 10]
    }
  },
  modelo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tipo: {
    type: DataTypes.ENUM('Coche', 'Moto', 'Especial', 'Electrico', 'Discapacitados'),
    allowNull: false
  }
}, {
  tableName: 'Vehiculo',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

export default Vehicle
