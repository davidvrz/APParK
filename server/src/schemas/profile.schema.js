import { z } from 'zod'

export const profileSchema = z.object({
  nombreCompleto: z.string().max(100, 'Nombre demasiado largo').optional(),
  telefono: z.string()
    .min(9)
    .max(15)
    .regex(/^\d+$/, 'El teléfono solo debe contener números')
    .optional(),
  currentPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(64, 'La contraseña no debe exceder de los 64 caracteres').optional(),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres').max(64, 'La nueva contraseña no debe exceder de los 64 caracteres').optional()
})
  .refine(data => {
    if (data.newPassword && !data.currentPassword) {
      return false
    }
    return true
  }, {
    message: 'Si deseas cambiar la contraseña, debes proporcionar la contraseña actual',
    path: ['currentPassword']
  })
