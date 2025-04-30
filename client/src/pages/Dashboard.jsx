import { useState, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import ReservasActivas from "@/components/dashboard/ReservasActivas"
import HistorialReservas from "@/components/dashboard/HistorialReservas"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { FavoriteParkings } from "@/components/dashboard/FavoriteParkings"
import { Vehicles } from "@/components/dashboard/Vehicles"
import { useAuth } from "@/hooks/useAuth"

export default function Dashboard() {
  const { user } = useAuth()
  const [expandedReservation, setExpandedReservation] = useState(null)

  const isExpanded = !!expandedReservation

  return (
    <LayoutGroup>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
        {/* Reservas Activas - Ocupa más espacio cuando está expandida */}
        <motion.div
          layout
          className={`${
            isExpanded ? "md:col-span-3 lg:col-span-4 row-span-3" : "md:col-span-2 lg:col-span-2 row-span-2"
          }`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <ReservasActivas onExpandReservation={setExpandedReservation} expandedReservationId={expandedReservation} />
        </motion.div>

        {/* Acciones Rápidas - Se oculta cuando hay una reserva expandida en móvil */}
        <AnimatePresence>
          {(!isExpanded || window.innerWidth >= 768) && (
            <motion.div
              layout
              className="md:col-span-1 lg:col-span-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <QuickActions />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mis Coches - Se oculta cuando hay una reserva expandida en móvil */}
        <AnimatePresence>
          {(!isExpanded || window.innerWidth >= 992) && (
            <motion.div
              layout
              className="md:col-span-1 lg:col-span-1 row-span-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Vehicles />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Historial de Reservas - Se oculta cuando hay una reserva expandida en móvil */}
        <AnimatePresence>
          {(!isExpanded || window.innerWidth >= 992) && (
            <motion.div
              layout
              className="md:col-span-2 lg:col-span-2 row-span-1"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, height: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <HistorialReservas />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
    
  )
}
