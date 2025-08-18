import Bull from 'bull'
import { redisConfig } from '../config.js'

const redisOptions = {
  host: redisConfig.redisHost,
  port: redisConfig.redisPort,
  password: redisConfig.redisPassword,
  username: redisConfig.redisUser,
  family: 0,
  connectTimeout: 60000
}

if (process.env.NODE_ENV === 'production') {
  const host = String(redisOptions.host || '').toLowerCase()
  // Use TLS ONLY for public/proxied hosts, NOT for Railway private networking
  const isPrivateRailway = host.endsWith('.railway.internal') || host === 'redis'
  if (!isPrivateRailway) {
    redisOptions.tls = { rejectUnauthorized: false }
  }
}

export const reservaQueue = new Bull('reserva', {
  redis: redisOptions
})

reservaQueue.on('error', (error) => {
  console.error('❌ Bull Queue Error:', error.message)
})

reservaQueue.on('ready', () => {
  console.log('✅ Bull Queue is ready and connected to Redis.')
})
