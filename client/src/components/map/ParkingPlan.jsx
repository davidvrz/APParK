import React, { useState, useEffect, useMemo } from 'react'
import { useSocketParking } from '@/hooks/useSocketParking'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Wifi, WifiOff, Car, Bike } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

const Plaza = ({ plaza, onSelect }) => {
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

  const [isRecent, setIsRecent] = useState(false)

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
        <div className="font-medium text-center">{plaza.numero}</div>
        <div className="flex items-center space-x-1 text-xs mt-1">
          <TipoPlazaIcon tipo={plaza.tipo} />
          <span>{plaza.tipo}</span>
        </div>
        {plaza.precioHora && (
          <div className="text-xs mt-1 font-medium">{plaza.precioHora}€/h</div>
        )}

        {/* Indicador de estado */}
        <Badge
          variant="outline"
          className={`absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] ${
            plaza.estado === 'Libre' ? 'bg-green-500 text-white' :
              plaza.estado === 'Ocupado' ? 'bg-red-500 text-white' :
                plaza.estado === 'Reservado' ? 'bg-amber-500 text-white' : 'bg-gray-500 text-white'
          }`}
        >
          {plaza.estado}
        </Badge>
      </motion.div>
    </AnimatePresence>
  )
}

const Planta = ({ planta, onSelectPlaza }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <h3 className="font-medium">Planta {planta.numero}</h3>
        <Badge variant="outline" className="px-2 py-0.5 bg-blue-50 text-blue-700 border-blue-200">
          {planta.plazas.length} plazas
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {planta.plazas.map(plaza => (
          <Plaza
            key={plaza.id}
            plaza={plaza}
            onSelect={() => onSelectPlaza(plaza)}
          />
        ))}
      </div>
    </div>
  )
}

const ParkingPlan = ({ parking, onSelectPlaza }) => {
  const [activePlanta, setActivePlanta] = useState(null)
  const [plantas, setPlantas] = useState([])

  const { connected, plazasActualizadas, actualizarEstadoPlaza, clearUpdates } = useSocketParking(parking?.id)

  useEffect(() => {
    if (parking && parking.plantas && parking.plantas.length > 0) {
      setPlantas(parking.plantas)
      setActivePlanta(String(parking.plantas[0].id))
    }
  }, [parking])

  useEffect(() => {
    if (plazasActualizadas.length > 0) {
      plazasActualizadas.forEach(update => {
        setPlantas(prevPlantas =>
          actualizarEstadoPlaza(update.id, update.estado, prevPlantas)
        )
      })
      clearUpdates()
    }
  }, [plazasActualizadas, actualizarEstadoPlaza, clearUpdates])

  // Memorizar la planta activa
  const activePlantaData = useMemo(() => {
    if (!plantas || plantas.length === 0) return null
    return plantas.find(p => String(p.id) === activePlanta) || plantas[0]
  }, [plantas, activePlanta])

  if (!parking) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-500">Cargando información del parking...</p>
      </div>
    )
  }

  if (!parking.plantas || parking.plantas.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <p className="text-gray-500">No hay información de plantas disponible para este parking.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Estado de la conexión socket */}
      <div className="flex items-center justify-end gap-1 text-sm text-gray-500">
        {connected ? (
          <>
            <Wifi className="h-4 w-4 text-green-500" />
            <span>Actualización en tiempo real activa</span>
          </>
        ) : (
          <>
            <WifiOff className="h-4 w-4 text-red-500" />
            <span>Actualización en tiempo real desconectada</span>
          </>
        )}
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-3 text-xs border rounded-md p-2 bg-gray-50">
        <span className="font-medium">Leyenda:</span>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
          <span>Libre</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
          <span>Ocupada</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
          <span>Reservada</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-400 mr-1"></div>
          <span>No reservable</span>
        </div>
      </div>

      {/* Pestañas para plantas si hay más de una */}
      {plantas.length > 1 ? (
        <Tabs value={activePlanta} onValueChange={setActivePlanta}>
          <TabsList className="flex-wrap">
            {plantas.map(planta => (
              <TabsTrigger key={planta.id} value={String(planta.id)}>
                Planta {planta.numero}
                <Badge variant="outline" className="ml-1.5 px-1.5 py-0 text-[10px]">
                  {planta.plazas.filter(p => p.estado === 'Libre' && p.reservable).length}/{planta.plazas.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {plantas.map(planta => (
            <TabsContent key={planta.id} value={String(planta.id)} className="pt-4">
              <Planta planta={planta} onSelectPlaza={onSelectPlaza} />
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        // Si solo hay una planta, mostrarla directamente
        activePlantaData && <Planta planta={activePlantaData} onSelectPlaza={onSelectPlaza} />
      )}
    </div>
  )
}

export default ParkingPlan