// Constantes de sistema para reservas
export const RESERVA_TIEMPO_MIN = 0 // minutos
export const RESERVA_TIEMPO_MAX = 120 // minutos
export const RESERVA_ANTICIPACION_MIN = 30 // minutos

// URLs de API para entornos
export const API_URL = import.meta.env.PROD
  ? 'https://api.production-url.com'
  : 'http://localhost:3000/api'