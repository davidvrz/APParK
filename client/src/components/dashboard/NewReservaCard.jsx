import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/Button"

const NewReservaCard = () => (
  <Link to="/map" className="h-full">
    <motion.div
      whileHover={{
        scale: 1.02,
      }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm h-full flex flex-col items-center justify-center cursor-pointer border border-dashed border-gray-200 dark:border-gray-700"
    >
      <div className="text-center p-8">
        <div className="mx-auto w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
          <PlusCircle className="h-7 w-7 text-blue-500 dark:text-blue-400" />
        </div>
        <h3 className="font-display text-lg font-medium tracking-tight text-gray-900 dark:text-gray-100 mb-2">
          Nueva Reserva
        </h3>
        <p className="text-sm font-normal text-gray-500 dark:text-gray-400 mb-4">
          Programa una nueva reserva de aparcamiento
        </p>
        <Button
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
        >
          Crear Reserva
        </Button>
      </div>
    </motion.div>
  </Link>
)

export default NewReservaCard
