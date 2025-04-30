import { useEffect, useState } from "react"
import {
  crearReserva,
  getReservasActivas,
  modificarReserva,
  cancelarReserva,
  eliminarReserva,
  getHistorialReservas
} from "@/api/reservas"

export const useReservas = () => {
  const [reservas, setReservas] = useState([])
  const [historial, setHistorial] = useState([])
  const [loading, setLoading] = useState(true)

  const refetchReservas = async () => {
    setLoading(true)
    try {
      const { reservas } = await getReservasActivas()
      setReservas(reservas || [])
    } catch (err) {
      console.error("Error al obtener reservas activas", err)
    } finally {
      setLoading(false)
    }
  }

  const refetchHistorial = async () => {
    setLoading(true)
    try {
      const { historial } = await getHistorialReservas()
      setHistorial(historial || [])
    } catch (err) {
      console.error("Error al obtener historial", err)
    } finally {
      setLoading(false)
    }
  }

  const crear = async (data) => {
    const res = await crearReserva(data)
    await refetchReservas()
    return res
  }

  const modificar = async (id, data) => {
    const res = await modificarReserva(id, data)
    await refetchReservas()
    return res
  }

  const cancelar = async (id) => {
    const res = await cancelarReserva(id)
    await refetchReservas()
    return res
  }

  const eliminar = async (id) => {
    const res = await eliminarReserva(id)
    await refetchReservas()
    return res
  }

  useEffect(() => {
    refetchReservas()
  }, [])

  return {
    reservas,
    historial,
    loading,
    crearReserva: crear,
    modificarReserva: modificar,
    cancelarReserva: cancelar,
    eliminarReserva: eliminar,
    refetchReservas,
    refetchHistorial
  }
}
