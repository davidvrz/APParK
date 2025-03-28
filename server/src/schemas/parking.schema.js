import { z } from 'zod'

export const parkingSchema = z.object({
  nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .max(100, 'El nombre no puede exceder 100 caracteres'),

  ubicacion: z.string()
    .min(1, 'La ubicación es obligatoria')
    .max(255, 'La ubicación no puede exceder 255 caracteres'),

  capacidad: z.number()
    .int('La capacidad debe ser un número entero positivo')
    .positive('La capacidad debe ser mayor que 0'),

  estado: z.enum(['Operativo', 'Cerrado', 'Mantenimiento']).optional()
})
