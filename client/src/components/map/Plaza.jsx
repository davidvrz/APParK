import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Bike } from 'lucide-react'

const Plaza = ({ plaza, onSelect, isUpdatedBySocket = false }) => {
  const [showUpdateEffect, setShowUpdateEffect] = useState(false)

  const TipoPlazaIcon = ({ tipo }) => {
    switch (tipo) {
    case 'Coche':
      return <Car className="h-3.5 w-3.5" />
    case 'Moto':
      return <Bike className="h-3.5 w-3.5" />
    case 'Especial':
    case 'VIP':
      return <span className="text-[10px] font-bold">VIP</span>
    case 'Eléctrico':
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
    }

    switch (plaza.estado) {
    case 'Libre':
      return `${baseStyles} bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-950/30 hover:border-green-300 dark:hover:border-green-700 hover:scale-105 hover:shadow-md`
    case 'Ocupado':
      return `${baseStyles} bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-300 cursor-not-allowed hover:scale-100`
    case 'Reservado':
      return `${baseStyles} bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 cursor-not-allowed hover:scale-100`
    default:
      return `${baseStyles} bg-muted/50 border-muted text-muted-foreground cursor-not-allowed hover:scale-100`
    }
  }

  const getBadgeColor = () => {
    switch (plaza.estado) {
    case 'Libre':
      return 'bg-green-500 hover:bg-green-600 text-white'
    case 'Ocupado':
      return 'bg-red-500 hover:bg-red-600 text-white'
    case 'Reservado':
      return 'bg-amber-500 hover:bg-amber-600 text-white'
    default:
      return 'bg-muted-foreground text-white'
    }
  }

  // Efecto de actualización por socket
  useEffect(() => {
    if (isUpdatedBySocket) {
      setShowUpdateEffect(true)
      const timeout = setTimeout(() => {
        setShowUpdateEffect(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [isUpdatedBySocket])

  const handleClick = () => {
    if (plaza.reservable && plaza.estado === 'Libre') {
      onSelect(plaza)
    }
  }

  return (
    <motion.div
      className={getEstadoStyles()}
      onClick={handleClick}
      animate={{
        scale: showUpdateEffect ? [1, 1.05, 1] : 1,
        boxShadow: showUpdateEffect
          ? '0 0 0 3px rgba(59, 130, 246, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)'
          : '0 1px 3px rgba(0, 0, 0, 0.1)'
      }}
      transition={{
        duration: showUpdateEffect ? 0.6 : 0.1,
      }}
      whileHover={
        plaza.reservable && plaza.estado === 'Libre'
          ? { scale: 1.05, y: -2 }
          : {}
      }
      whileTap={
        plaza.reservable && plaza.estado === 'Libre'
          ? { scale: 0.98 }
          : {}
      }
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

      <Badge
        variant="secondary"
        className={`absolute -top-2 -right-2 px-2 py-0.5 text-[10px] font-medium border-0 ${getBadgeColor()} shadow-sm`}
      >
        {plaza.estado}
      </Badge>

      {plaza.reservable && plaza.estado === 'Libre' && (
        <div className="absolute inset-0 rounded-xl border-2 border-transparent bg-gradient-to-br from-transparent via-transparent to-primary/5 opacity-0 hover:opacity-100 transition-opacity duration-200" />
      )}
    </motion.div>
  )
}

export default Plaza
