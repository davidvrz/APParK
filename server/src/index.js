import app from './app.js'
import 'dotenv/config'
import { connectDB } from './database/db.js'
import './jobs/reserva.worker.js'

const PORT = process.env.PORT || 3000

const main = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ No se pudo iniciar el servidor:', error)
    process.exit(1)
  }
}

main()
