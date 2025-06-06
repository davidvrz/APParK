import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import ReservasActivas from "@/components/dashboard/ReservasActivas"
import HistorialReservas from "@/components/dashboard/HistorialReservas"
import { QuickActions } from "@/components/dashboard/QuickActions"

export default function Dashboard() {
  return (
    <LayoutGroup>
      <div className="flex flex-col space-y-10">
        {/* Primera fila: Reservas Activas */}
        <motion.div
          layout
          className="w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ReservasActivas />
        </motion.div>

        {/* Segunda fila: Paneles secundarios */}
        <AnimatePresence>
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Panel de Acciones Rápidas */}
            <motion.div
              className="md:col-span-6 lg:col-span-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <QuickActions />
            </motion.div>

            {/* Panel de Historial de Reservas */}
            <motion.div
              className="md:col-span-6 lg:col-span-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <HistorialReservas />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </LayoutGroup>
  )
}
