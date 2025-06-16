import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card"
import FormError from "@/components/ui/FormError"

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [telefono, setTelefono] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validateFields = () => {
    const newErrors = {}

    if (!nombre.trim()) newErrors.nombre = "El nombre es obligatorio"
    else if (nombre.length < 3) newErrors.nombre = "El nombre debe tener al menos 3 caracteres"
    if (!email.trim()) newErrors.email = "El correo electrónico es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "El correo electrónico no es válido"
    if (!password.trim()) newErrors.password = "La contraseña es obligatoria"
    else if (password.length < 6) newErrors.password = "La contraseña debe tener al menos 6 caracteres"

    if (telefono && telefono.trim() && !/^\d{9,15}$/.test(telefono)) {
      newErrors.telefono = "El teléfono debe contener entre 9 y 15 dígitos numéricos"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const fieldErrors = validateFields()
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors)
      return
    }

    setLoading(true)
    setErrors({})

    const result = await register(nombre, email, password, telefono)

    if (result.ok) {
      navigate("/dashboard")
    } else {
      // Manejar errores del backend
      if (result.fieldErrors) {
        // Errores de validación específicos por campo
        setErrors(result.fieldErrors)
      } else if (typeof result.error === 'string') {
        // Error general
        setErrors({ general: result.error })
      } else {
        setErrors({ general: "Error desconocido durante el registro." })
      }
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Crear Cuenta</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Mostrar error general si existe */}
            {errors.general && <FormError message={errors.general} />}            <div className="space-y-1">
              <label className="text-sm font-medium">Nombre completo</label>
              <Input
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
              {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Correo electrónico</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Teléfono (Opcional)</label>
              <Input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Número de teléfono"
              />
              {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono}</p>}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Registrándose..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground text-center">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-primary underline-offset-4 hover:underline font-medium"
            >
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Register
