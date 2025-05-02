import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with webpack/vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
})

// Spanish center coordinates (around Madrid)
const defaultCenter = [40.416775, -3.70379]

const ParkingMap = ({ parkings = [], onSelectParking }) => {
  const getGeocodeForParking = (parking) => {
    // This is a simplified approach - in a real application you would:
    // 1. Either store lat/lng in your parking model
    // 2. Or use a geocoding service (Google Maps, Mapbox, etc.) to convert addresses to coordinates
    // For this example, we'll create random locations around Spain
    
    // Create deterministic "random" positions based on parking ID for demo
    const id = parking.id || 0
    const latOffset = (id * 0.05) % 2 - 1
    const lngOffset = (id * 0.07) % 2 - 1
    
    return [defaultCenter[0] + latOffset, defaultCenter[1] + lngOffset]
  }

  return (
    <MapContainer 
      center={defaultCenter} 
      zoom={6} 
      style={{ height: '100%', width: '100%' }}
      whenCreated={(mapInstance) => {
        // Optional: store map instance in state if needed
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {parkings.map((parking) => {
        const position = getGeocodeForParking(parking)
        
        return (
          <Marker
            key={parking.id}
            position={position}
            eventHandlers={{
              click: () => onSelectParking(parking),
            }}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{parking.nombre}</h3>
                <p>{parking.ubicacion}</p>
                <button 
                  className="text-blue-600 hover:underline mt-2"
                  onClick={(e) => {
                    e.preventDefault()
                    onSelectParking(parking)
                  }}
                >
                  Ver detalles
                </button>
              </div>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}

export default ParkingMap