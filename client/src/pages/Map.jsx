import { useState, useEffect } from 'react'
import { useParking } from '@/hooks/useParking'
import ParkingMap from '@/components/map/ParkingMap'
import ParkingDetails from '@/components/map/ParkingDetails'
import { Card, CardContent } from '@/components/ui/Card'

const Map = () => {
  const { parkings, loading, error, fetchParkings } = useParking()
  const [selectedParking, setSelectedParking] = useState(null)
  const [isDetailExpanded, setIsDetailExpanded] = useState(false)

  useEffect(() => {
    fetchParkings()
  }, [fetchParkings])

  const handleParkingSelect = (parking) => {
    setSelectedParking(parking)
    setIsDetailExpanded(true)
  }

  const handleCloseDetails = () => {
    setIsDetailExpanded(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg">Cargando parkings...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4">
        <h1 className="text-2xl font-bold">Mapa de Parkings</h1>
        <p className="text-gray-500">Encuentra y reserva plazas de parking cercanas</p>
      </div>

      <div className="flex-grow relative">
        {isDetailExpanded && selectedParking ? (
          <ParkingDetails
            parking={selectedParking}
            onClose={handleCloseDetails}
          />
        ) : (
          <Card className="h-full">
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