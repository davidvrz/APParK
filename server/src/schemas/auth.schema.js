import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email('El correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(64, 'La contraseña no debe exceder los 64 caracteres'),
  nombreCompleto: z.string().min(1, 'El nombre completo es obligatorio').max(100, 'El nombre no debe exceder los 100 caracteres'),
  telefono: z.string()
    .optional()
    .transform((value) => value === '' ? undefined : value)
    .refine((value) => value === undefined || (/^\d+$/.test(value) && value.length >= 9 && value.length <= 15), {
      message: 'El teléfono debe contener entre 9 y 15 dígitos numéricos'
    })
})

export const loginSchema = z.object({
  email: z.string().min(1, 'El correo electrónico es obligatorio').email('El correo electrónico no es válido'),
  password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'La contraseña debe tener al menos 6 caracteres').max(64, 'La contraseña no debe exceder los 64 caracteres')
})
