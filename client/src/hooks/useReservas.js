import { useEffect, useState } from 'react'
import { getReservasActivas } from '../api/reservas.js'

export const useReservas = () => {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const { reservas } = await getReservasActivas()
        setReservas(Array.isArray(reservas) ? reservas : [])
      } catch (err) {
        console.error('Error al obtener reservas:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReservas()
  }, [])

  return { reservas, loading }
}
