import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useState, useEffect } from 'react'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

const mapContainerStyle = {
  height: '100%',
  width: '100%',
  minHeight: '300px',
  borderRadius: '8px',
  zIndex: 0
}

const MiniMap = ({ latitude, longitude }) => {
  const lat = Number(latitude)
  const lng = Number(longitude)
  const hasValidCoords = !isNaN(lat) && !isNaN(lng)

  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (document.querySelector('.leaflet-container')) {
        window.dispatchEvent(new Event('resize'))
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  // Si no hay coordenadas válidas, mostrar un placeholder
  if (!hasValidCoords) {
    return (
      <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 h-full w-full rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          No hay coordenadas disponibles
        </p>
      </div>
    )
  }

  const position = [lat, lng]

  return (
    <div className="h-full w-full relative z-0 rounded-lg overflow-hidden">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        dragging={true}
        doubleClickZoom={true}
        style={mapContainerStyle}
        attributionControl={false}
        className="map-container z-0"
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={position} />
        <ZoomControl position="bottomright" />
      </MapContainer>
    </div>
  )
}

export default MiniMap