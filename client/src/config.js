// Constantes de sistema para reservas
export const RESERVA_TIEMPO_MIN = 15 // minutos
export const RESERVA_TIEMPO_MAX = 480 // minutos
export const RESERVA_ANTICIPACION_MIN = 30 // minutos

// URLs configurables por variables de entorno
// Docker Compose: http://localhost:3001/api (puerto expuesto por docker-compose)
// Producción: se configurará via VITE_API_URL en Railway
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'