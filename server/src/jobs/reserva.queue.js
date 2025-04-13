import Bull from 'bull'
import { redisConfig } from '../config.js'

// cola "reserva" conectada a Redis
export const reservaQueue = new Bull('reserva', {
  redis: {
    host: redisConfig.redisHost,
    port: redisConfig.redisPort
  }
})
