import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Link } from "react-router-dom"

// Importamos las ilustraciones
import mapIllustration from "@/assets/Paper map-cuate.svg"
import timeIllustration from "@/assets/time flies-rafiki.svg"
import carIllustration from "@/assets/By my car-rafiki.svg"
import cityIllustration from "@/assets/City driver-rafiki.svg"

export function QuickActions() {  const actions = [
  {
    image: mapIllustration,
    label: "Buscar Parking",
    link: "/map",
  },
  {
    image: timeIllustration,
    label: "Mis Reservas",
    link: "/reservas/activas",
  },
  {
    image: carIllustration,
    label: "Mis Vehículos",
    link: "/vehiculos",
  },
  {
    image: cityIllustration,
    label: "Mi Historial",
    link: "/reservas/historial",
  },
]

return (
  <div className="grid grid-cols-2 gap-5 h-full">
    {actions.map((action, index) => (
      <motion.div
        key={action.label}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{
          scale: 1.06,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08)"
        }}
        className="bg-white dark:bg-gray-800/60 rounded-2xl shadow-lg overflow-hidden h-full border border-gray-100 dark:border-gray-700/50"
      >
        <Link to={action.link} className="h-full">
          <Button
            variant="ghost"
            className="w-full h-full flex flex-col items-center justify-between p-4 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <div className="flex-grow flex items-center justify-center w-full mb-2 p-2 overflow-hidden">
              <img
                src={action.image}
                alt={action.label}
                className="h-36 w-36 object-contain"
              />
            </div>
            <div className="text-center">
              <span className="font-display font-medium text-lg tracking-tight block">{action.label}</span>
            </div>
          </Button>
        </Link>
      </motion.div>
    ))}
  </div>
)
}
