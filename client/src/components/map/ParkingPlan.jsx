import React, { useState, useEffect, useMemo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import Planta from './Planta'

const ParkingPlan = ({ parking, onSelectPlaza, reservaData = {} }) => {
  const [activePlanta, setActivePlanta] = useState(null)

  const plantas = useMemo(() => parking?.plantas || [], [parking?.plantas])

  useEffect(() => {
    if (plantas.length > 0 && !activePlanta) {
      setActivePlanta(String(plantas[0].id))
    }
  }, [plantas, activePlanta])

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
      </div>

      {plantas.length > 1 ? (
        <div className="space-y-4">
          {/* Botones para seleccionar planta */}
          <div className="flex flex-wrap gap-2 justify-center items-center">
            {plantas.map(planta => (
              <Button
                key={planta.id}
                variant={String(planta.id) === activePlanta ? "default" : "outline"}
                onClick={() => setActivePlanta(String(planta.id))}
                className="flex items-center gap-1.5 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 min-w-0 flex-shrink-0 max-w-[140px] sm:max-w-none"
                size="sm"
              >
                <span className="truncate">Planta {planta.numero}</span>
                <Badge
                  variant="secondary"
                  className="h-4 sm:h-5 px-1.5 sm:px-2 text-xs flex-shrink-0"
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
              reservaData={reservaData}
            />
          )}
        </div>
      ) : (
        // Si solo hay una planta, mostrarla directamente
        activePlantaData && (
          <Planta
            planta={activePlantaData}
            onSelectPlaza={onSelectPlaza}
            reservaData={reservaData}
          />
        )
      )}
    </div>
  )
}

export default ParkingPlan