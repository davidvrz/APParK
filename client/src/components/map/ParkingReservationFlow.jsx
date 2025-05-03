import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ParkingPlan from './ParkingPlan'
import ReservationForm from './ReservationForm'
import { ArrowLeft, Map, ClipboardCheck } from 'lucide-react'

/**
 * Componente de flujo de reserva que integra el plano del parking y el formulario de reserva
 */
const ParkingReservationFlow = ({ parking, onCancel, skipPlano = false }) => {
  const [selectedPlaza, setSelectedPlaza] = useState(null)
  const [showPlano, setShowPlano] = useState(!skipPlano)

  // Inicializar el estado cuando cambia la prop skipPlano
  useEffect(() => {
    if (skipPlano) {
      setShowPlano(false)
    }
  }, [skipPlano])

  // Manejar la selección de una plaza del plano
  const handlePlazaSelect = (plaza) => {
    setSelectedPlaza(plaza)
    setShowPlano(false)
  }

  // Volver al plano sin selección
  const handleBackToPlano = () => {
    setShowPlano(true)
  }

  // Crear una estructura de plantas compatible con el formulario que incluya solo la plaza seleccionada
  const getPlantasWithSelectedPlaza = () => {
    if (!selectedPlaza) return parking?.plantas || []

    // Encontrar la planta que contiene la plaza seleccionada
    const planta = parking?.plantas?.find(p =>
      p.plazas.some(pz => pz.id === selectedPlaza.id)
    )

    if (!planta) return []

    // Crear una versión de la planta que solo incluye la plaza seleccionada
    return [{
      ...planta,
      plazas: [selectedPlaza]
    }]
  }

  return (
    <Card className="w-full">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>
              {showPlano ? 'Plano del Parking' : 'Realizar Reserva'}
            </CardTitle>

            {selectedPlaza && !showPlano && (
              <span className="text-sm text-muted-foreground">
                Plaza {selectedPlaza.numero} - Tipo {selectedPlaza.tipo}
              </span>
            )}
          </div>

          {!showPlano && !skipPlano && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToPlano}
              className="gap-1"
            >
              <Map className="h-4 w-4" />
              <span>Ver plano</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {showPlano ? (
          <ParkingPlan
            parking={parking}
            onSelectPlaza={handlePlazaSelect}
          />
        ) : (
          <ReservationForm
            parkingId={parking.id}
            plantas={getPlantasWithSelectedPlaza()}
            onCancel={skipPlano ? onCancel : handleBackToPlano}
            preselectedPlazaId={selectedPlaza?.id}
          />
        )}
      </CardContent>

      {showPlano && (
        <CardFooter className="border-t p-4">
          <div className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>

            {/* Mensaje de ayuda */}
            <div className="text-sm text-muted-foreground flex items-center">
              <ClipboardCheck className="h-4 w-4 mr-1" />
              Selecciona una plaza libre para hacer una reserva
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

export default ParkingReservationFlow