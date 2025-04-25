import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-white to-purple-200 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-md bg-white/30 border border-white/30 rounded-2xl shadow-xl p-10 max-w-md w-full text-center"
      >
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-gray-700 text-lg mb-6">
          Uy, parece que esta página no existe.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-6 py-2 bg-primary/90 text-white rounded-md hover:bg-primary transition duration-200"
        >
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
