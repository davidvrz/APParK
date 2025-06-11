import React, { useState, useEffect, useMemo } from 'react'
import { useSocketParking } from '@/hooks/useSocketParking'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Wifi, WifiOff } from 'lucide-react'
import Planta from './Planta'

const ParkingPlan = ({ parking, onSelectPlaza }) => {
  const [activePlanta, setActivePlanta] = useState(null)
  const [plantas, setPlantas] = useState([])

  const { connected, plazasActualizadas, actualizarEstadoPlaza, clearUpdates } = useSocketParking(parking?.id)

  useEffect(() => {
    if (parking && parking.plantas && parking.plantas.length > 0) {
      console.log('🔄 ParkingPlan: Cargando datos del parking')
      setPlantas(parking.plantas)
    }
  }, [parking])

  useEffect(() => {
    if (plantas.length > 0 && !activePlanta) {
      setActivePlanta(String(plantas[0].id))
    }
  }, [plantas, activePlanta])

  // Actualizaciones en tiempo real
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