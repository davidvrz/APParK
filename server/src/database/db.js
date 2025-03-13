import { Sequelize } from 'sequelize'

const DB_NAME = process.env.DB_NAME
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_HOST = process.env.DB_HOST
const DB_PORT = process.env.DB_PORT || 3306

// Crear instancia de Sequelize
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: true
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
