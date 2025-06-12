import React, { useState, useEffect, useMemo } from 'react'
import { useSocketParking } from '@/hooks/useSocketParking'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'
import Planta from './Planta'

const ParkingPlan = ({ parking, onSelectPlaza }) => {
  const [activePlanta, setActivePlanta] = useState(null)
  const [plantas, setPlantas] = useState([])

  const { plazasActualizadas, actualizarEstadoPlaza, clearUpdates } = useSocketParking(parking?.id)

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
      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-green-500"></div>
          <span>Libre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Ocupada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-amber-500"></div>
          <span>Reservada</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-full bg-gray-400"></div>
          <span>No reservable</span>
        </div>
      </div>      {plantas.length > 1 ? (
        <div className="space-y-4">
          {/* Botones para seleccionar planta */}
          <div className="flex gap-2 justify-center">
            {plantas.map(planta => (
              <Button
                key={planta.id}
                variant={String(planta.id) === activePlanta ? "default" : "outline"}
                onClick={() => setActivePlanta(String(planta.id))}
                className="flex items-center gap-2"
              >
                <span>Planta {planta.numero}</span>
                <Badge
                  variant="secondary"
                  className="h-5 px-2 text-xs"
                >
                  {planta.plazas.filter(p => p.estado === 'Libre' && p.reservable).length}/{planta.plazas.length}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Mostrar planta activa */}
          {activePlantaData && (
            <Planta
              planta={activePlantaData}
              onSelectPlaza={onSelectPlaza}
              plazasActualizadas={plazasActualizadas}
            />
          )}
        </div>
      ) : (
        // Si solo hay una planta, mostrarla directamente
        activePlantaData && (
          <Planta
            planta={activePlantaData}
            onSelectPlaza={onSelectPlaza}
            plazasActualizadas={plazasActualizadas}
          />
        )
      )}
    </div>
  )
}

export default ParkingPlan