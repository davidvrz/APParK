import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'

const Plaza = sequelize.define('Plaza', {
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reservable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  tipo: {
    type: DataTypes.ENUM('Coche', 'Moto', 'Especial', 'Eléctrico', 'Discapacitados', 'VIP'),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('Libre', 'Ocupado', 'Reservado'),
    allowNull: false,
    defaultValue: 'Libre'
  },
  precioHora: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'precio_por_hora'
  }
}, {
  tableName: 'Plaza',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

export default Plaza
