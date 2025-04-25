import { motion } from 'framer-motion'

function AuthFormWrapper({ title, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-white to-primary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/30 backdrop-blur-md border border-white/20"
      >
        <h1 className="text-2xl font-heading text-center text-dark mb-6">{title}</h1>
        {children}
      </motion.div>
    </div>
  )
}

export default AuthFormWrapper
