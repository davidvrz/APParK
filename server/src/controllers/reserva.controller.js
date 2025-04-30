import { Op } from 'sequelize'
import Reserva from '../models/reserva.model.js'
import ReservaRapida from '../models/reservaRapida.model.js'
import Parking from '../models/parking.model.js'
import Planta from '../models/planta.model.js'
import Plaza from '../models/plaza.model.js'
import Vehicle from '../models/vehicle.model.js'
import { sequelize } from '../database/db.js'
import pick from 'lodash/pick.js'
import { reservaQueue } from '../jobs/reserva.queue.js'
import { RESERVA_TIEMPO_MIN, RESERVA_TIEMPO_MAX, RESERVA_ANTICIPACION_MIN } from '../config.js'
import { getIO } from '../sockets/index.js'

export const createReserva = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { id: userId } = req.user
    const { vehicleId, plazaId, startTime, endTime } = req.body

    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (start <= now) {
      await transaction.rollback()
      return res.status(400).json({ error: 'La reserva debe programarse para un momento futuro' })
    }

    const diffAntelacion = (start - now) / (1000 * 60)
    if (diffAntelacion < RESERVA_ANTICIPACION_MIN) {
      await transaction.rollback()
      return res.status(400).json({
        error: `Las reservas deben hacerse con al menos ${RESERVA_ANTICIPACION_MIN} minutos de antelación`
      })
    }

    const diffMin = (end - start) / (1000 * 60)
    if (diffMin < RESERVA_TIEMPO_MIN || diffMin > RESERVA_TIEMPO_MAX) {
      await transaction.rollback()
      return res.status(400).json({
        error: `La reserva debe durar entre ${RESERVA_TIEMPO_MIN} y ${RESERVA_TIEMPO_MAX} minutos`
      })
    }

    const vehicle = await Vehicle.findOne({
      where: { id: vehicleId, usuario_id: userId },
      transaction
    })

    if (!vehicle) {
      await transaction.rollback()
      return res.status(403).json({ error: 'Vehículo no válido para este usuario' })
    }

    const plaza = await Plaza.findByPk(plazaId, { transaction })
    if (!plaza) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Plaza no encontrada' })
    }

    if (!plaza.reservable) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Esta plaza no está disponible para reservas normales' })
    }

    const overlapping = await Reserva.findOne({
      where: {
        plaza_id: plazaId,
        estado: 'activa',
        [Op.or]: [
          { startTime: { [Op.between]: [startTime, endTime] } },
          { endTime: { [Op.between]: [startTime, endTime] } },
          {
            startTime: { [Op.lte]: startTime },
            endTime: { [Op.gte]: endTime }
          }
        ]
      },
      transaction
    })

    if (overlapping) {
      await transaction.rollback()
      return res.status(400).json({ error: 'La plaza ya está reservada en ese horario' })
    }

    const overlappingVehicle = await Reserva.findOne({
      where: {
        vehiculo_id: vehicleId,
        estado: 'activa',
        [Op.or]: [
          { startTime: { [Op.between]: [startTime, endTime] } },
          { endTime: { [Op.between]: [startTime, endTime] } },
          {
            startTime: { [Op.lte]: startTime },
            endTime: { [Op.gte]: endTime }
          }
        ]
      },
      transaction
    })

    if (overlappingVehicle) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Este vehículo ya tiene una reserva en ese horario' })
    }

    if (vehicle.tipo !== plaza.tipo) {
      await transaction.rollback()
      return res.status(400).json({ error: `Una plaza de tipo ${plaza.tipo} no es compatible con un vehículo de tipo ${vehicle.tipo}` })
    }

    const durationHours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)
    const precioTotal = durationHours * plaza.precioHora

    const reserva = await Reserva.create({
      user_id: userId,
      vehiculo_id: vehicleId,
      plaza_id: plazaId,
      startTime,
      endTime,
      precioTotal
    }, { transaction })

    await reservaQueue.removeJobs(`${reserva.id}`)
    const delay = new Date(endTime).getTime() - Date.now()
    console.log(`\n\nReserva ${reserva.id} programada para completarse en ${delay} ms\n\n`)
    await reservaQueue.add(
      'completar-reserva',
      { reservaId: reserva.id },
      {
        delay,
        jobId: `${reserva.id}`
      }
    )

    await Plaza.update({ estado: 'Reservado' }, {
      where: { id: plazaId },
      transaction
    })

    await transaction.commit()

    const createdReserva = pick(reserva.get(), [
      'id', 'user_id', 'vehiculo_id', 'plaza_id', 'startTime', 'endTime', 'estado', 'precioTotal'
    ])

    getIO().emit('parking:update', {
      plazaId,
      nuevoEstado: 'Reservado',
      tipo: 'reserva_creada'
    })

    res.status(201).json({ reserva: createdReserva })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
}

export const getReservasByUser = async (req, res) => {
  try {
    const { id: userId } = req.user

    const reservas = await Reserva.findAll({
      where: { user_id: userId, estado: 'activa' },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'matricula', 'tipo']
        },
        {
          model: Plaza,
          as: 'plaza',
          attributes: ['id', 'numero', 'tipo', 'precioHora'],
          include: {
            model: Planta,
            as: 'planta',
            attributes: ['numero'],
            include: {
              model: Parking,
              as: 'parking',
              attributes: ['id', 'nombre', 'ubicacion']
            }
          }
        }
      ],
      order: [['startTime', 'ASC']]
    })

    const formatted = reservas.map(reserva => {
      const base = pick(reserva.get(), ['id', 'startTime', 'endTime', 'estado', 'precioTotal'])

      return {
        ...base,
        vehicle: pick(reserva.vehicle, ['id', 'matricula', 'tipo']),
        plaza: pick(reserva.plaza, ['id', 'numero', 'tipo', 'precioHora']),
        planta: pick(reserva.plaza.planta, ['numero']),
        parking: pick(reserva.plaza.planta.parking, ['id', 'nombre', 'ubicacion'])
      }
    })

    res.status(200).json({ reservas: formatted })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateReserva = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { reservaId } = req.params
    const { startTime, endTime, vehicleId, plazaId } = req.body
    const { id: userId } = req.user

    const reserva = await Reserva.findByPk(reservaId, { transaction })
    if (!reserva) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }

    if (reserva.estado !== 'activa') {
      await transaction.rollback()
      return res.status(400).json({ error: 'Solo se pueden modificar reservas activas' })
    }

    const now = new Date()
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (new Date(reserva.startTime) <= now) {
      await transaction.rollback()
      return res.status(400).json({ error: 'No se puede modificar una reserva ya iniciada' })
    }

    const diffAntelacion = (start - now) / (1000 * 60)
    if (diffAntelacion < RESERVA_ANTICIPACION_MIN) {
      await transaction.rollback()
      return res.status(400).json({
        error: `Las reservas deben hacerse con al menos ${RESERVA_ANTICIPACION_MIN} minutos de antelación`
      })
    }

    const diffMin = (end - start) / (1000 * 60)
    if (diffMin < RESERVA_TIEMPO_MIN || diffMin > RESERVA_TIEMPO_MAX) {
      await transaction.rollback()
      return res.status(400).json({
        error: `La reserva debe durar entre ${RESERVA_TIEMPO_MIN} y ${RESERVA_TIEMPO_MAX} minutos`
      })
    }

    const vehicle = await Vehicle.findOne({
      where: { id: vehicleId, usuario_id: userId },
      transaction
    })

    if (!vehicle) {
      await transaction.rollback()
      return res.status(403).json({ error: 'Vehículo no válido para este usuario' })
    }

    const plaza = await Plaza.findByPk(plazaId, { transaction })
    if (!plaza) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Plaza no encontrada' })
    }

    if (!plaza.reservable) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Esta plaza no está disponible para reservas normales' })
    }

    if (vehicle.tipo !== plaza.tipo) {
      await transaction.rollback()
      return res.status(400).json({
        error: `Una plaza de tipo ${plaza.tipo} no es compatible con un vehículo de tipo ${vehicle.tipo}`
      })
    }

    const overlappingPlaza = await Reserva.findOne({
      where: {
        id: { [Op.ne]: reservaId },
        plaza_id: plazaId,
        estado: 'activa',
        [Op.or]: [
          { startTime: { [Op.between]: [startTime, endTime] } },
          { endTime: { [Op.between]: [startTime, endTime] } },
          {
            startTime: { [Op.lte]: startTime },
            endTime: { [Op.gte]: endTime }
          }
        ]
      },
      transaction
    })

    if (overlappingPlaza) {
      await transaction.rollback()
      return res.status(400).json({ error: 'La plaza ya está reservada en ese horario' })
    }

    const overlappingVehicle = await Reserva.findOne({
      where: {
        id: { [Op.ne]: reservaId },
        vehiculo_id: vehicleId,
        estado: 'activa',
        [Op.or]: [
          { startTime: { [Op.between]: [startTime, endTime] } },
          { endTime: { [Op.between]: [startTime, endTime] } },
          {
            startTime: { [Op.lte]: startTime },
            endTime: { [Op.gte]: endTime }
          }
        ]
      },
      transaction
    })

    if (overlappingVehicle) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Este vehículo ya tiene una reserva en ese horario' })
    }

    if (reserva.plaza_id !== plazaId) {
      await Plaza.update({ estado: 'Libre' }, {
        where: { id: reserva.plaza_id },
        transaction
      })

      await Plaza.update({ estado: 'Reservado' }, {
        where: { id: plazaId },
        transaction
      })
    }

    const durationHours = (new Date(endTime) - new Date(startTime)) / (1000 * 60 * 60)
    const precioTotal = durationHours * plaza.precioHora

    await reserva.update({
      vehiculo_id: vehicleId,
      plaza_id: plazaId,
      startTime,
      endTime,
      precioTotal
    }, { transaction })

    await reservaQueue.removeJobs(`${reserva.id}`)

    const delay = new Date(endTime).getTime() - Date.now()

    await reservaQueue.add(
      'completar-reserva',
      { reservaId: reserva.id },
      {
        delay,
        jobId: `${reserva.id}`
      }
    )

    await transaction.commit()

    const updated = pick(reserva.get(), [
      'id', 'user_id', 'vehiculo_id', 'plaza_id', 'startTime', 'endTime', 'estado', 'precioTotal'
    ])

    if (reserva.plaza_id !== plazaId) {
      getIO().emit('parking:update', {
        plazaId: reserva.plaza_id, // plaza anterior
        nuevoEstado: 'Libre',
        tipo: 'reserva_modificada'
      })

      getIO().emit('parking:update', {
        plazaId, // nueva plaza
        nuevoEstado: 'Reservado',
        tipo: 'reserva_modificada'
      })
    }

    res.status(200).json({ reserva: updated })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
}

export const cancelReserva = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { reservaId } = req.params

    const reserva = await Reserva.findByPk(reservaId, { transaction })
    if (!reserva) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }

    if (reserva.estado !== 'activa') {
      await transaction.rollback()
      return res.status(400).json({ error: 'Solo se pueden cancelar reservas activas' })
    }

    await Plaza.update({ estado: 'Libre' }, {
      where: { id: reserva.plaza_id },
      transaction
    })

    reserva.estado = 'cancelada'
    await reserva.save({ transaction })

    await reservaQueue.removeJobs(`${reserva.id}`)
    await transaction.commit()

    getIO().emit('parking:update', {
      plazaId: reserva.plaza_id,
      nuevoEstado: 'Libre',
      tipo: 'reserva_cancelada'
    })

    res.status(200).json({ message: 'Reserva cancelada correctamente' })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
}

export const deleteReserva = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { reservaId } = req.params

    const reserva = await Reserva.findByPk(reservaId, { transaction })
    if (!reserva) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Reserva no encontrada' })
    }

    if (reserva.estado === 'activa') {
      await Plaza.update({ estado: 'Libre' }, {
        where: { id: reserva.plaza_id },
        transaction
      })
    }

    await reserva.destroy({ transaction })
    await transaction.commit()

    getIO().emit('parking:update', {
      plazaId: reserva.plaza_id,
      nuevoEstado: 'Libre',
      tipo: 'reserva_eliminada'
    })

    res.status(200).json({ message: 'Reserva eliminada correctamente' })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
}

export const getHistorialReservasByUser = async (req, res) => {
  try {
    const { id: userId } = req.user

    const reservas = await Reserva.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Vehicle,
          as: 'vehicle',
          attributes: ['id', 'matricula', 'tipo']
        },
        {
          model: Plaza,
          as: 'plaza',
          attributes: ['id', 'numero', 'tipo', 'precioHora'],
          include: {
            model: Planta,
            as: 'planta',
            attributes: ['numero'],
            include: {
              model: Parking,
              as: 'parking',
              attributes: ['id', 'nombre', 'ubicacion']
            }
          }
        }
      ],
      order: [['startTime', 'DESC']]
    })

    const formattedHistorial = reservas.map(reserva => ({
      ...pick(reserva.get(), ['id', 'startTime', 'endTime', 'estado', 'precioTotal']),
      vehicle: pick(reserva.vehicle, ['id', 'matricula', 'tipo']),
      plaza: pick(reserva.plaza, ['id', 'numero', 'tipo', 'precioHora']),
      planta: pick(reserva.plaza.planta, ['numero']),
      parking: pick(reserva.plaza.planta.parking, ['id', 'nombre', 'ubicacion'])
    }))

    res.status(200).json({ historial: formattedHistorial })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getReservasParking = async (req, res) => {
  const { parkingId } = req.params

  try {
    const reservas = await Reserva.findAll({
      where: { estado: 'activa' },
      include: {
        model: Plaza,
        as: 'plaza',
        attributes: ['id', 'numero', 'tipo', 'estado'],
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
      order: [['startTime', 'ASC']]
    })

    const formatted = reservas.map(reserva => {
      const base = pick(reserva.get(), ['id', 'startTime', 'precioTotal'])
      return {
        ...base,
        plaza: pick(reserva.plaza, ['id', 'numero', 'tipo', 'estado']),
        planta: pick(reserva.plaza.planta, ['numero'])
      }
    })

    res.status(200).json({ reservas: formatted })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getReservasRapidasParking = async (req, res) => {
  const { parkingId } = req.params

  try {
    const reservas = await ReservaRapida.findAll({
      where: { estado: 'activa' },
      include: {
        model: Plaza,
        as: 'plaza',
        attributes: ['id', 'numero', 'tipo', 'estado'],
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
      order: [['startTime', 'ASC']]
    })

    const formatted = reservas.map(reserva => {
      const base = pick(reserva.get(), ['id', 'startTime', 'matricula'])
      return {
        ...base,
        plaza: pick(reserva.plaza, ['id', 'numero', 'tipo', 'estado']),
        planta: pick(reserva.plaza.planta, ['numero']),
        parking: pick(reserva.plaza.planta.parking, ['id', 'nombre'])
      }
    })

    res.status(200).json({ reservasRapidas: formatted })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createReservaRapida = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { plazaId, matricula, tipoVehiculo } = req.body

    const plaza = await Plaza.findByPk(plazaId, { transaction })
    if (!plaza) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Plaza no encontrada' })
    }

    if (plaza.reservable) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Esta plaza no está disponible para reservas rápidas' })
    }

    if (plaza.estado !== 'Libre') {
      await transaction.rollback()
      return res.status(400).json({ error: 'Plaza no disponible' })
    }

    if (plaza.tipo !== tipoVehiculo) {
      await transaction.rollback()
      return res.status(400).json({
        error: `La plaza de tipo ${plaza.tipo} no es compatible con un vehículo de tipo ${tipoVehiculo}`
      })
    }

    const reservaExistente = await ReservaRapida.findOne({
      where: {
        matricula,
        estado: 'activa'
      },
      transaction
    })

    if (reservaExistente) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Ya existe una reserva rápida activa con esta matrícula' })
    }

    const now = new Date()

    const reserva = await ReservaRapida.create({
      plaza_id: plazaId,
      startTime: now,
      estado: 'activa',
      matricula
    }, { transaction })

    await Plaza.update({ estado: 'Ocupado' }, {
      where: { id: plazaId },
      transaction
    })

    await transaction.commit()

    const createdReserva = pick(reserva.get(), [
      'id', 'plaza_id', 'startTime', 'estado', 'matricula'
    ])

    getIO().emit('parking:update', {
      plazaId,
      nuevoEstado: 'Ocupado',
      tipo: 'reserva_rapida_creada'
    })

    res.status(201).json({ reserva: createdReserva })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
}

export const completeReservaRapida = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { plazaId } = req.body

    if (!plazaId) {
      return res.status(400).json({ error: 'Se requiere plazaId y matrícula' })
    }

    const reserva = await ReservaRapida.findOne({
      where: {
        plaza_id: plazaId,
        estado: 'activa'
      },
      transaction
    })

    if (!reserva) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Reserva activa no encontrada' })
    }

    const now = new Date()

    const plaza = await Plaza.findByPk(plazaId, { transaction })
    if (!plaza) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Plaza no encontrada' })
    }

    const durationHours = (now - new Date(reserva.startTime)) / (1000 * 60 * 60)
    const precioTotal = parseFloat((durationHours * plaza.precioHora).toFixed(2))

    reserva.endTime = now
    reserva.estado = 'completada'
    reserva.precioTotal = precioTotal
    await reserva.save({ transaction })

    await Plaza.update({ estado: 'Libre' }, {
      where: { id: plazaId },
      transaction
    })

    await transaction.commit()

    const completed = pick(reserva.get(), [
      'id', 'startTime', 'endTime', 'estado', 'precioTotal'
    ])

    getIO().emit('parking:update', {
      plazaId,
      nuevoEstado: 'Libre',
      tipo: 'reserva_rapida_completada'
    })

    res.status(200).json({
      message: 'Reserva rápida completada correctamente',
      reserva: completed
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
}
