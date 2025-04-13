import { reservaQueue } from './reserva.queue.js'
import Reserva from '../models/reserva.model.js'
import Plaza from '../models/plaza.model.js'
// import { io } from '../sockets/index.js'

reservaQueue.process(async job => {
  const { reservaId } = job.data

  try {
    const reserva = await Reserva.findByPk(reservaId)
    if (!reserva || reserva.estado !== 'activa') return

    reserva.estado = 'completada'
    await reserva.save()

    await Plaza.update(
      { estado: 'Libre' },
      { where: { id: reserva.plaza_id } }
    )
    /*
    io.emit('reserva:completada', {
      plazaId: reserva.plazaId,
      reservaId: reserva.id
    })
    */
  } catch (err) {
    console.error(`❌ Error al completar reserva ${reservaId}`, err)
  }
})
