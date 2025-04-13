import { z } from 'zod'

export const reservaRapidaSchema = z.object({
  plazaId: z.number().int().positive({ message: 'La plaza es obligatoria' }),
  matricula: z.string()
    .min(4, 'Matrícula demasiado corta')
    .max(10, 'Matrícula demasiado larga')
    .regex(/^[A-Z0-9]+$/, 'Formato de matrícula no válido'),
  tipoVehiculo: z.enum(['Coche', 'Moto', 'Furgoneta'], {
    required_error: 'Tipo de vehículo requerido'
  }),
  endTime: z.date().optional(),
  precioTotal: z.number().positive().optional()
})
