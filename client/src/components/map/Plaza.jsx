import React, { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { Car, Bike } from 'lucide-react'

const Plaza = ({ plaza, onSelect }) => {
  const [isRecent, setIsRecent] = useState(false)

  const TipoPlazaIcon = ({ tipo }) => {
    switch (tipo) {
    case 'Coche':
      return <Car className="h-4 w-4" />
    case 'Moto':
      return <Bike className="h-4 w-4" />
    case 'Especial':
    case 'VIP':
      return <span className="text-xs font-bold">VIP</span>
    case 'Eléctrico':
      return <span className="text-xs font-bold">⚡</span>
    case 'Discapacitados':
      return <span className="text-xs font-bold">♿</span>
    default:
      return <Car className="h-4 w-4" />
    }
  }

  const getEstadoClasses = () => {
    if (!plaza.reservable) {
      return 'bg-gray-200 border-gray-300 text-gray-600 cursor-not-allowed'
    }
    switch (plaza.estado) {
    case 'Libre':
      return 'bg-green-100 border-green-400 text-green-800 hover:bg-green-200 cursor-pointer'
    case 'Ocupado':
      return 'bg-red-100 border-red-400 text-red-800 cursor-not-allowed'
    case 'Reservado':
      return 'bg-amber-100 border-amber-400 text-amber-800 cursor-not-allowed'
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800'
    }
  }

  const getBadgeClasses = () => {
    switch (plaza.estado) {
    case 'Libre':
      return 'bg-green-500 text-white'
    case 'Ocupado':
      return 'bg-red-500 text-white'
    case 'Reservado':
      return 'bg-amber-500 text-white'
    default:
      return 'bg-gray-500 text-white'
    }
  }

  useEffect(() => {
    setIsRecent(true)
    const timeout = setTimeout(() => {
      setIsRecent(false)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [plaza.estado])

  const handleClick = () => {
    if (plaza.reservable && plaza.estado === 'Libre') {
      onSelect(plaza)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`relative rounded-md border p-2 flex flex-col items-center justify-center h-24 shadow-sm ${getEstadoClasses()}`}
        onClick={handleClick}
        initial={{ scale: isRecent ? 0.9 : 1 }}
        animate={{
          scale: 1,
          boxShadow: isRecent ? '0 0 0 3px rgba(59, 130, 246, 0.5)' : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
        }}
        transition={{ duration: 0.3 }}
        whileHover={plaza.reservable && plaza.estado === 'Libre' ? { scale: 1.05 } : {}}
      >
        <div className="font-medium text-center">
          {plaza.numero}
        </div>

        <div className="flex items-center space-x-1 text-xs mt-1">
          <TipoPlazaIcon tipo={plaza.tipo} />
          <span>{plaza.tipo}</span>
        </div>

        {plaza.precioHora && (
          <div className="text-xs mt-1 font-medium">
            {plaza.precioHora}€/h
          </div>
        )}

        <Badge
          variant="outline"
          className={`absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] ${getBadgeClasses()}`}
        >
          {plaza.estado}
        </Badge>
      </motion.div>
    </AnimatePresence>
  )
}

export default Plaza
