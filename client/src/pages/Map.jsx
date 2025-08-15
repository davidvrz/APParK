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
      <div className="flex justify-center items-center h-full p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Cargando parkings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-full p-6">
        <div className="text-center">
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-xl mb-4">
            <p className="text-red-600 dark:text-red-400 font-medium">Error al cargar la información</p>
          </div>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex flex-col h-full">
      {isDetailExpanded && selectedParking ? (
        <ParkingDetails
          parking={selectedParking}
          onClose={handleCloseDetails}
          initialSection="plan"
        />
      ) : (
        <div className="flex flex-col space-y-6">
          {/* Título de la página */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mapa de Parkings</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Encuentra y reserva plazas de aparcamiento en tiempo real
            </p>
          </div>
          {/* Contenedor del mapa */}
          <div className="h-[calc(100vh-250px)] w-full rounded-xl overflow-hidden shadow-sm">
            <Card className="h-full w-full border-border/20">
              <CardContent className="p-0 h-full">
                <ParkingMap
                  parkings={parkings}
                  onSelectParking={handleParkingSelect}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default Map