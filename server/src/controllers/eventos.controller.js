import Eventos from '../models/eventos.model.js'
import Reserva from '../models/reserva.model.js'
import ReservaRapida from '../models/reservaRapida.model.js'
import Parking from '../models/parking.model.js'
import Planta from '../models/planta.model.js'
import Plaza from '../models/plaza.model.js'
import { Op } from 'sequelize'
import pick from 'lodash/pick.js'

export const registrarEventos = async ({ plazaId, matricula = null, tipoEvento, mensaje = '' }) => {
  try {
    await Eventos.create({
      plaza_id: plazaId,
      matricula,
      tipoEvento,
      mensaje
    })
    console.log(`Evento registrado: [${tipoEvento}] Plaza ${plazaId} - ${mensaje}`)
  } catch (error) {
    console.error('Error al registrar evento del sistema:', error.message)
  }
}

export const getEventosByParkingId = async (req, res) => {
  const { parkingId } = req.params

  try {
    const eventos = await Eventos.findAll({
      include: {
        model: Plaza,
        as: 'plaza',
        attributes: ['id', 'numero', 'reservable', 'tipo', 'estado'],
        include: {
          model: Planta,
          as: 'planta',
          attributes: ['numero'],
          include: {
            model: Parking,
            as: 'parking',
            where: { id: parkingId },
            attributes: ['id', 'nombre']
          }
        }
      },
      order: [['fecha', 'DESC']]
    })

    const formattedEventos = eventos.map(evento => ({
      id: evento.id,
      plazaId: evento.plaza_id,
      matricula: evento.matricula,
      tipoEvento: evento.tipoEvento,
      mensaje: evento.mensaje,
      fecha: evento.fecha,
      plaza: evento.plaza
        ? pick(evento.plaza, ['id', 'numero', 'reservable', 'tipo', 'estado'])
        : null,
      planta: evento.plaza?.planta
        ? pick(evento.plaza.planta, ['numero'])
        : null,
      parking: evento.plaza?.planta?.parking
        ? pick(evento.plaza.planta.parking, ['id', 'nombre'])
        : null
    }))

    res.status(200).json({ eventos: formattedEventos })
  } catch (error) {
    console.error(' Error al obtener eventos del parking:', error.message)
    res.status(500).json({ error: 'Error interno al recuperar eventos del sistema' })
  }
}

export const procesarEventoSensor = async (req, res) => {
  const { plazaId, matricula, tipoEvento } = req.body

  if (!plazaId || !matricula || !tipoEvento) {
    return res.status(400).json({ error: 'Se requiere plazaId, matrícula y tipoEvento' })
  }

  const now = new Date()

  try {
    const plaza = await Plaza.findByPk(plazaId)
    if (!plaza) {
      await registrarEventos({ plazaId, matricula, tipoEvento: 'anomalia', mensaje: 'Plaza no encontrada' })
      return res.status(404).json({ error: 'Plaza no encontrada' })
    }

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

    // ENTRADA
    if (tipoEvento === 'entrada') {
      if (reserva) {
        await registrarEventos({ plazaId, matricula, tipoEvento: 'entrada', mensaje: 'Vehículo llegó correctamente a su plaza reservada' })
        return res.status(200).json({ message: 'Entrada válida registrada (reserva normal)' })
      }

      if (reservaRapida) {
        await registrarEventos({ plazaId, matricula, tipoEvento: 'entrada', mensaje: 'Vehículo llegó a su plaza de reserva rápida' })
        return res.status(200).json({ message: 'Entrada válida registrada (reserva rápida)' })
      }

      await registrarEventos({ plazaId, matricula, tipoEvento: 'anomalia', mensaje: 'Entrada sin reserva activa' })
      return res.status(403).json({ error: 'Entrada no autorizada: sin reserva activa' })
    }

    // SALIDA
    if (tipoEvento === 'salida') {
      if (reservaRapida) {
        const durationHours = (now - new Date(reservaRapida.startTime)) / (1000 * 60 * 60)
        const precioTotal = parseFloat((durationHours * plaza.precioHora).toFixed(2))

        reservaRapida.endTime = now
        reservaRapida.estado = 'completada'
        reservaRapida.precioTotal = precioTotal
        await reservaRapida.save()

        await Plaza.update({ estado: 'Libre' }, { where: { id: plazaId } })

        await registrarEventos({ plazaId, matricula, tipoEvento: 'salida', mensaje: 'Reserva rápida completada correctamente' })
        return res.status(200).json({ message: 'Salida registrada y reserva rápida completada' })
      }

      if (reserva) {
        await registrarEventos({ plazaId, matricula, tipoEvento: 'salida', mensaje: 'Salida registrada para reserva normal (pendiente de completar automáticamente)' })
        return res.status(200).json({ message: 'Salida registrada (reserva normal)' })
      }

      await registrarEventos({ plazaId, matricula, tipoEvento: 'anomalia', mensaje: 'Salida sin reserva activa' })
      return res.status(403).json({ error: 'Salida no autorizada: sin reserva activa' })
    }

    return res.status(400).json({ error: 'Tipo de evento no reconocido' })
  } catch (error) {
    console.error(' Error al procesar evento del sensor:', error.message)
    res.status(500).json({ error: 'Error interno al procesar el evento del sensor' })
  }
}
