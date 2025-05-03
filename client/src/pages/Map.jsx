import { useState, useEffect } from 'react'
import { useParking } from '@/hooks/useParking'
import ParkingMap from '@/components/map/ParkingMap'
import ParkingDetails from '@/components/map/ParkingDetails'
import { Card, CardContent } from '@/components/ui/card'

const Map = () => {
  const { parkings, loading, error, fetchParkings } = useParking()
  const [selectedParking, setSelectedParking] = useState(null)
  const [isDetailExpanded, setIsDetailExpanded] = useState(false)

  useEffect(() => {
    fetchParkings()
  }, [fetchParkings])

  // Función para manejar la selección de un parking desde el mapa
  const handleParkingSelect = (parking) => {
    setSelectedParking(parking)
    setIsDetailExpanded(true)
  }

  // Función para volver al mapa
  const handleCloseDetails = () => {
    setIsDetailExpanded(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[700px]">
        <p className="text-lg">Cargando parkings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[700px]">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 pb-6">
        <h1 className="text-2xl font-bold">Mapa de Parkings</h1>
        <p className="text-gray-500">Encuentra y reserva plazas de parking cercanas</p>
      </div>

      <div className="h-[700px] w-full rounded-lg overflow-hidden">
        {isDetailExpanded && selectedParking ? (
          <ParkingDetails
            parking={selectedParking}
            onClose={handleCloseDetails}
            initialSection="info"
          />
        ) : (
          <Card className="h-full w-full">
            <CardContent className="p-0 h-full">
              <ParkingMap
                parkings={parkings}
                onSelectParking={handleParkingSelect}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default Map