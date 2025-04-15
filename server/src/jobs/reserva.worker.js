import { reservaQueue } from './reserva.queue.js'
import Reserva from '../models/reserva.model.js'
import Plaza from '../models/plaza.model.js'

// Procesar el job "completar-reserva"
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

    console.log(`✅ Reserva completada automáticamente: Reserva #${reserva.id}`)

    /*
    io.emit('reserva:completada', {
      plazaId: reserva.plazaId,
      reservaId: reserva.id
    })
    */
  } catch (err) {
    console.error(`❌ [Bull] Error al completar la reserva ${reservaId}:`, err.message)
  }
})
