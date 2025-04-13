import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'
import Plaza from './plaza.model.js'

const Planta = sequelize.define('Planta', {
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'Planta',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

Planta.hasMany(Plaza, { foreignKey: 'planta_id', as: 'plazas', onDelete: 'CASCADE' })
Plaza.belongsTo(Planta, { foreignKey: 'planta_id', as: 'planta' })

export default Planta
