import Bull from 'bull'
import { redisConfig } from '../config.js'

export const reservaQueue = new Bull('reserva', {
  redis: {
    host: redisConfig.redisHost,
    port: redisConfig.redisPort
  }
})
