import { ZodError } from 'zod'

const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({
        error: 'Error de validación',
        details: error.errors
      })
    }
    next(error)
  }
}

export default validateSchema
