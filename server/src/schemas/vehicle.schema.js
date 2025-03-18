import { z } from 'zod'

export const vehicleSchema = z.object({
  matricula: z.string()
    .min(4, 'La matrícula debe tener al menos 4 caracteres')
    .max(10, 'La matrícula debe tener como máximo 10 caracteres')
    .regex(/^[A-Z0-9]+$/, 'Formato de matrícula inválido'),
  tipo: z.enum(['Coche', 'Moto', 'Especial'])
})
