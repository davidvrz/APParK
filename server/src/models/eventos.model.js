import { DataTypes } from 'sequelize'
import { sequelize } from '../database/db.js'
import Plaza from './plaza.model.js'

const Eventos = sequelize.define('Eventos', {
  tipoEvento: {
    type: DataTypes.ENUM('salida', 'entrada', 'anomalia'),
    allowNull: false,
    field: 'tipo_evento'
  },
  matricula: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'Eventos',
  timestamps: false
})

Eventos.belongsTo(Plaza, { foreignKey: 'plaza_id', as: 'plaza' })

export default Eventos
