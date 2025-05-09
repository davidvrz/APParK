import { Sequelize } from 'sequelize'
import { DB } from '../config.js'

const DB_NAME = DB.NAME
const DB_USER = DB.USER
const DB_PASSWORD = DB.PASSWORD
const DB_HOST = DB.HOST
const DB_PORT = DB.PORT || 3306

// Crear instancia de Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false
})

// Probar la conexión
const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ Conexión a la base de datos exitosa')
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error)
    process.exit(1)
  }
}

export { sequelize, connectDB }
