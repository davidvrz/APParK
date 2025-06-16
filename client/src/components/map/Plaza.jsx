import React from 'react'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { Car, Bike } from 'lucide-react'

const Plaza = ({ plaza, onSelect, reservaData = {} }) => {

  const TipoPlazaIcon = ({ tipo }) => {
    switch (tipo) {
    case 'Coche':
      return <Car className="h-3.5 w-3.5" />
    case 'Moto':
      return <Bike className="h-3.5 w-3.5" />
    case 'Especial':
      return <span className="text-[10px] font-bold">ESP</span>
    case 'VIP':
      return <span className="text-[10px] font-bold">VIP</span>
    case 'Electrico':
      return <span className="text-xs">⚡</span>
    case 'Discapacitados':
      return <span className="text-xs">♿</span>
    default:
      return <Car className="h-3.5 w-3.5" />
    }
  }

  const getEstadoStyles = () => {
    const baseStyles = "relative rounded-xl border-2 p-3 flex flex-col items-center justify-center h-32 transition-all duration-300 cursor-pointer"

    if (!plaza.reservable) {
      return `${baseStyles} bg-muted/50 border-muted text-muted-foreground cursor-not-allowed hover:scale-100`
    }    const stateStyles = {
      Libre: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/30 hover:border-green-300 dark:hover:border-green-700 hover:scale-105 hover:shadow-md",
      Ocupado: "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300 cursor-not-allowed hover:scale-100",
      Reservado: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/30 hover:border-amber-300 dark:hover:border-amber-700 hover:scale-105 hover:shadow-md"
    }

    return `${baseStyles} ${stateStyles[plaza.estado] || stateStyles.Ocupado}`
  }

  const getBadgeColor = () => {
    const colors = {
      Libre: "bg-green-500 text-white",
      Ocupado: "bg-red-500 text-white",
      Reservado: "bg-amber-500 text-white"
    }
    return colors[plaza.estado] || "bg-gray-500 text-white"  }
  const handleClick = () => {
    if (plaza.reservable && (plaza.estado === 'Libre' || plaza.estado === 'Reservado')) {
      onSelect(plaza)
    }
  }
  // Calcular número de reservas esta semana si está disponible la función
  const { getReservasEstaSemana = () => [] } = reservaData
  const reservasEstaSemana = plaza.estado === 'Reservado' ?
    getReservasEstaSemana(plaza.id).length : 0

  return (
    <motion.div
      className={getEstadoStyles()}
      onClick={handleClick}      whileHover={plaza.reservable && (plaza.estado === 'Libre' || plaza.estado === 'Reservado') ? { scale: 1.05, y: -2 } : {}}
      whileTap={plaza.reservable && (plaza.estado === 'Libre' || plaza.estado === 'Reservado') ? { scale: 0.98 } : {}}
    >
      <div className="font-display font-bold text-lg mb-1">
        {plaza.numero}
      </div>

      <div className="flex items-center gap-1 text-xs mb-1 opacity-80">
        <TipoPlazaIcon tipo={plaza.tipo} />
        <span className="font-medium truncate">{plaza.tipo}</span>
      </div>

      {plaza.precioHora && (
        <div className="text-[10px] font-semibold opacity-70">
          {plaza.precioHora}€/h
        </div>
      )}

      {/* Mostrar número de reservas esta semana para plazas reservadas */}
      {plaza.estado === 'Reservado' && reservasEstaSemana > 0 && (
        <div className="text-[9px] text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 px-1 py-0.5 rounded mt-1">
          {reservasEstaSemana} reserva{reservasEstaSemana !== 1 ? 's' : ''} esta semana
        </div>
      )}

      <Badge
        className={`absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-medium border-0 pointer-events-none ${getBadgeColor()}`}
      >
        {plaza.estado}
      </Badge>
    </motion.div>
  )
}

export default Plaza
