import { useEffect, useState } from 'react'
import { getHistorialReservas } from '../api/reservas'

export const useHistorial = (limite = null) => {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const { historial } = await getHistorialReservas()
        setReservas(limite ? historial.slice(0, limite) : historial)
      } catch (err) {
        console.error('Error al obtener historial:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchHistorial()
  }, [limite])

  return { reservas, loading }
}
