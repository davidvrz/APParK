import Eventos from '../models/eventos.model.js'
import Reserva from '../models/reserva.model.js'
import ReservaRapida from '../models/reservaRapida.model.js'
import Plaza from '../models/plaza.model.js'
import { Op } from 'sequelize'

// Eventos del sistema - log de eventos
export const registrarEventos = async ({ plazaId, matricula = null, tipoEvento, mensaje = '' }) => {
  try {
    await Eventos.create({
      plaza_id: plazaId,
      matricula,
      tipoEvento,
      mensaje
    })
    console.log(`✅ Evento registrado: [${tipoEvento}] Plaza ${plazaId} - ${mensaje}`)
  } catch (error) {
    console.error('❌ Error al registrar evento del sistema:', error.message)
  }
}

// Eventos del sistema - log de eventos
export const getEventos = async (req, res) => {
  try {
    const eventos = await Eventos.findAll({
      include: {
        model: Plaza,
        as: 'plaza',
        attributes: ['id', 'numero', 'tipo', 'estado']
      },
      order: [['fecha', 'DESC']]
    })

    const formateados = eventos.map(e => ({
      id: e.id,
      plazaId: e.plaza_id,
      matricula: e.matricula,
      tipoEvento: e.tipoEvento,
      mensaje: e.mensaje,
      fecha: e.fecha,
      plaza: e.plaza
        ? {
            id: e.plaza.id,
            numero: e.plaza.numero,
            tipo: e.plaza.tipo,
            estado: e.plaza.estado
          }
        : null
    }))

    res.status(200).json({ eventos: formateados })
  } catch (error) {
    console.error('❌ Error al obtener eventos del sistema:', error.message)
    res.status(500).json({ error: 'Error interno al recuperar eventos del sistema' })
  }
}

// Evento fisico del sensor
export const procesarEventoSensor = async (req, res) => {
  const { plazaId, matricula, tipoEvento } = req.body

  if (!plazaId || !matricula || !tipoEvento) {
    return res.status(400).json({ error: 'Se requiere plazaId, matrícula y tipoEvento' })
  }

  const now = new Date()

  try {
    // Obtener la plaza y comprobar existencia
    const plaza = await Plaza.findByPk(plazaId)
    if (!plaza) {
      await registrarEventos({ plazaId, matricula, tipoEvento: 'anomalia', mensaje: 'Plaza no encontrada' })
      return res.status(404).json({ error: 'Plaza no encontrada' })
    }

    // Buscar reserva activa en ese momento con esa matrícula (normal o rápida)
    const reserva = await Reserva.findOne({
      where: {
        plaza_id: plazaId,
        estado: 'activa',
        startTime: { [Op.lte]: now },
        endTime: { [Op.gte]: now },
        '$vehicle.matricula$': matricula
      },
      include: ['vehicle']
    })

    const reservaRapida = await ReservaRapida.findOne({
      where: {
        plaza_id: plazaId,
        estado: 'activa',
        matricula
      }
    })

    // Evento tipo ENTRADA
    if (tipoEvento === 'entrada') {
      if (reserva) {
        await registrarEventos({
          plazaId,
          matricula,
          tipoEvento: 'entrada',
          mensaje: 'Vehículo llegó correctamente a su plaza reservada'
        })
        return res.status(200).json({ message: 'Entrada válida registrada' })
      }

      if (reservaRapida) {
        await registrarEventos({
          plazaId,
          matricula,
          tipoEvento: 'entrada',
          mensaje: 'Vehículo llegó a su plaza de reserva rápida'
        })
        return res.status(200).json({ message: 'Entrada válida registrada (reserva rápida)' })
      }

      await registrarEventos({
        plazaId,
        matricula,
        tipoEvento: 'anomalia',
        mensaje: 'No hay reserva activa para esta plaza y matrícula'
      })
      return res.status(403).json({ error: 'Entrada no autorizada: sin reserva activa' })
    }

    // Evento tipo SALIDA
    if (tipoEvento === 'salida') {
      if (reservaRapida) {
        // Completar reserva rápida
        const durationHours = (now - new Date(reservaRapida.startTime)) / (1000 * 60 * 60)
        const precioTotal = parseFloat((durationHours * plaza.precioHora).toFixed(2))

        reservaRapida.endTime = now
        reservaRapida.estado = 'completada'
        reservaRapida.precioTotal = precioTotal
        await reservaRapida.save()

        await Plaza.update({ estado: 'Libre' }, { where: { id: plazaId } })

        await registrarEventos({
          plazaId,
          matricula,
          tipoEvento: 'salida',
          mensaje: 'Reserva rápida completada correctamente'
        })

        return res.status(200).json({ message: 'Salida registrada y reserva rápida completada' })
      }

      if (reserva) {
        // No completamos reserva normal automáticamente (la completará Bull)
        await registrarEventos({
          plazaId,
          matricula,
          tipoEvento: 'salida',
          mensaje: 'Salida detectada para reserva normal (sin acción)'
        })
        return res.status(200).json({ message: 'Salida registrada (reserva normal)' })
      }

      // No hay reserva asociada → posible uso indebido
      await registrarEventos({
        plazaId,
        matricula,
        tipoEvento: 'anomalia',
        mensaje: 'Salida detectada sin reserva activa'
      })

      return res.status(403).json({ error: 'Salida no autorizada: sin reserva activa' })
    }

    return res.status(400).json({ error: 'Tipo de evento no reconocido' })
  } catch (error) {
    console.error('❌ Error al procesar evento del sensor:', error.message)
    return res.status(500).json({ error: 'Error al procesar el evento del sensor' })
  }
}
