import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

// Default center coordinates (España)
const defaultCenter = [40.416775, -3.70379]

// Componente para actualizar la vista del mapa cuando cambian los parkings
function MapUpdater({ parkings }) {
  const map = useMap()

  useEffect(() => {
    if (parkings && parkings.length > 0) {
      // Si hay parkings, crear un bounds para ajustar el mapa
      try {
        const bounds = L.latLngBounds(
          parkings.map(parking => [
            Number(parking.latitud),
            Number(parking.longitud)
          ])
        )

        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [50, 50] })
        }
      } catch (error) {
        console.error("Error ajustando el mapa:", error)
      }
    }
  }, [parkings, map])

  return null
}

const ParkingMap = ({ parkings = [], onSelectParking }) => {
  const [mapReady, setMapReady] = useState(false)

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={defaultCenter}
        zoom={6}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {parkings.map((parking) => {
          // Usar las coordenadas reales del parking desde la base de datos
          const position = [
            Number(parking.latitud) || defaultCenter[0],
            Number(parking.longitud) || defaultCenter[1]
          ]

          return (
            <Marker
              key={parking.id}
              position={position}
              eventHandlers={{
                click: () => onSelectParking(parking)
              }}
            >
              <Popup>
                <div className="text-center">
                  <strong>{parking.nombre}</strong>
                  <p className="text-sm">{parking.ubicacion}</p>
                  <p className="text-sm mt-1">
                    <span className="text-green-600">{parking.plazasLibres}</span> plazas libres
                  </p>
                </div>
              </Popup>
            </Marker>
          )
        })}

        {mapReady && <MapUpdater parkings={parkings} />}
      </MapContainer>
    </div>
  )
}

export default ParkingMap