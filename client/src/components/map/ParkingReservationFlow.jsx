import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import ParkingPlan from './ParkingPlan'
import ReservationForm from './ReservationForm'
import { ArrowLeft, Map, ClipboardCheck, Wifi, WifiOff } from 'lucide-react'
import { useSocketParking } from '@/hooks/useSocketParking'

const ParkingReservationFlow = ({ parking, onCancel, onReservaSuccess, skipPlano = false }) => {
  const [selectedPlaza, setSelectedPlaza] = useState(null)
  const [showPlano, setShowPlano] = useState(!skipPlano)

  const { connected } = useSocketParking(parking?.id)

  useEffect(() => {
    if (skipPlano) {
      setShowPlano(false)
    }
  }, [skipPlano])

  const handlePlazaSelect = (plaza) => {
    setSelectedPlaza(plaza)
    setShowPlano(false)
  }

  const handleBackToPlano = () => {
    setShowPlano(true)
  }

  const handleReservaSuccess = () => {
    if (onReservaSuccess) {
      onReservaSuccess()
    }

    setTimeout(() => {
      setSelectedPlaza(null)
      setShowPlano(true)
    }, 2000)
  }

  const getPlantasWithSelectedPlaza = () => {
    if (!selectedPlaza) return parking?.plantas || []

    const planta = parking?.plantas?.find(p =>
      p.plazas.some(pz => pz.id === selectedPlaza.id)
    )

    if (!planta) return []

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

          {showPlano ? (
            /* Indicador de tiempo real cuando se muestra el plano */
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {connected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span>Tiempo real activo</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span>Tiempo real desconectado</span>
                </>
              )}
            </div>
          ) : (
            !skipPlano && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBackToPlano}
                className="gap-1"
              >
                <Map className="h-4 w-4" />
                <span>Ver plano</span>
              </Button>
            )
          )}
        </div>
      </CardHeader>

      <CardContent className="p-8">
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
            onReservaSuccess={handleReservaSuccess}
            preselectedPlazaId={selectedPlaza?.id}
          />
        )}
      </CardContent>

      {showPlano && (
        <CardFooter className="border-t p-4">
          <div className="flex justify-between w-full">
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