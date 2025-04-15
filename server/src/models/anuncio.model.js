import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'
import Parking from './parking.model.js'

const Anuncio = sequelize.define('Anuncio', {
  contenido: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  tableName: 'Anuncio',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

// Asociación con Parking
Anuncio.belongsTo(Parking, { foreignKey: 'parking_id', as: 'parking' })
Parking.hasMany(Anuncio, { foreignKey: 'parking_id', as: 'anuncios' })

export default Anuncio
