import { z } from 'zod'
import { RESERVA_TIEMPO_MIN, RESERVA_TIEMPO_MAX } from '../config.js'

export const reservaSchema = z.object({
  vehicleId: z.number().int().positive().nullable().optional(),
  plazaId: z.number().int().positive(),
  startTime: z.coerce.date({ required_error: 'La fecha de inicio es obligatoria' }),
  endTime: z.coerce.date({ required_error: 'La fecha de fin es obligatoria' }),
  estado: z.enum(['active', 'completed', 'cancelled']).optional(),
  precio_total: z.number().positive().optional(),
  matricula: z.string()
    .regex(/^[0-9]{4}\s?[A-Z]{3}$/, {
      message: 'Formato de matrícula inválido (Ej: 1234 ABC)'
    })
    .optional()
})
  .refine(data => data.endTime > data.startTime, {
    message: 'La fecha de fin debe ser posterior a la de inicio',
    path: ['endTime']
  })

  .refine(data => {
    const diffMin = (data.endTime - data.startTime) / (1000 * 60)
    return diffMin >= RESERVA_TIEMPO_MIN && diffMin <= RESERVA_TIEMPO_MAX
  }, {
    message: `La reserva debe durar entre ${RESERVA_TIEMPO_MIN} y ${RESERVA_TIEMPO_MAX} minutos`,
    path: ['endTime']
  })

  .refine(data => data.vehicleId || data.matricula, {
    message: 'Debe proporcionar un vehículo o una matrícula',
    path: ['vehicleId']
  })
