import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(64, 'La contraseña no debe exceder de los 64 caracteres').optional(),
  nombreCompleto: z.string().max(100),
  telefono: z.string()
    .min(9)
    .max(15)
    .regex(/^\d+$/, 'El teléfono solo debe contener números')
    .optional(),
  rol: z.enum(['admin', 'conductor'])
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(64, 'La contraseña no debe exceder de los 64 caracteres').optional()
})
