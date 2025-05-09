import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

// Default coordenadas (España)
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

  const getEstadoColor = (estado) => {
    switch(estado) {
    case 'Operativo': return 'text-green-600'
    case 'Cerrado': return 'text-red-600'
    case 'Mantenimiento': return 'text-amber-600'
    default: return 'text-slate-600'
    }
  }

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
              <Tooltip
                direction="top"
                offset={[0, -32]}
                opacity={1}
                className="custom-tooltip"
              >
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-primary">{parking.nombre}</h3>
                  <p className="text-xs mt-1 text-slate-600">{parking.ubicacion}</p>
                  <div className="flex justify-between items-center mt-2 text-xs">
                    <span className="text-slate-700">Capacidad: <span className="font-medium">{parking.capacidad}</span></span>
                    <span className={getEstadoColor(parking.estado)}>
                      <span className="font-medium">{parking.estado || 'Operativo'}</span>
                    </span>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          )
        })}

        {mapReady && <MapUpdater parkings={parkings} />}
      </MapContainer>
    </div>
  )
}

export default ParkingMap