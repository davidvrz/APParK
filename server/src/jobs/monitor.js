import { createBullBoard } from '@bull-board/api'
import { ExpressAdapter } from '@bull-board/express'
import { BullAdapter } from '@bull-board/api/bullAdapter.js'
import { reservaQueue } from './reserva.queue.js'

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
  queues: [new BullAdapter(reservaQueue)],
  serverAdapter
})

export default serverAdapter.getRouter()
