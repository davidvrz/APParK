import { reservaQueue } from './reserva.queue.js'
import Reserva from '../models/reserva.model.js'
import Plaza from '../models/plaza.model.js'
import { getIO } from '../sockets/index.js'

reservaQueue.process('completar-reserva', async job => {
  const { reservaId } = job.data

  try {
    const reserva = await Reserva.findByPk(reservaId)
    if (!reserva || reserva.estado !== 'activa') {
      console.log(`⚠️ Job completado pero la reserva ${reservaId} no existe o ya está finalizada`)
      return
    }

    reserva.estado = 'completada'
    await reserva.save()

    await Plaza.update(
      { estado: 'Libre' },
      { where: { id: reserva.plaza_id } }
    )

    getIO().emit('parking:update', {
      plazaId: reserva.plaza_id,
      nuevoEstado: 'Libre',
      tipo: 'reserva_completada'
    })

    console.log(`✅ Reserva completada automáticamente: Reserva #${reserva.id}`)
  } catch (err) {
    console.error(`❌ [Bull] Error al completar la reserva ${reservaId}:`, err.message)
  }
})
