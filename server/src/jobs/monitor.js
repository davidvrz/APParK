import { createBullBoard } from '@bull-board/api'
import { ExpressAdapter } from '@bull-board/express'
import { BullAdapter } from '@bull-board/api/bullAdapter.js'
import { reservaQueue } from './reserva.queue.js'

// Crear el adaptador de Express
const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues') // que coincida con la ruta usada en app.js

// Crear Bull Board y conectar la cola
createBullBoard({
  queues: [new BullAdapter(reservaQueue)],
  serverAdapter
})

export default serverAdapter.getRouter()
