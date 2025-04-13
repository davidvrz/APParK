import { Router } from 'express'
import { getEventosSensor, postEventoSensor, procesarEventoSensor } from '../controllers/eventos.controller.js'
import { adminAuth } from '../middlewares/admin.middleware.js'
import { parkingAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/', parkingAuth, postEventoSensor)
router.get('/', adminAuth, getEventosSensor)
router.post('/sensor', parkingAuth, procesarEventoSensor)

export default router
