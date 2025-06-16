import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import FormError from "@/components/ui/FormError"

function Login() {
  const { login, isAuthenticated, user, isAuthChecked } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthChecked && isAuthenticated) {
      if (user?.rol === 'admin') {
        navigate("/admin/dashboard", { replace: true })
      } else {
        navigate("/dashboard", { replace: true })
      }
    }
  }, [isAuthChecked, isAuthenticated, user, navigate])

  const validateFields = () => {
    const newErrors = {}
    if (!email) newErrors.email = "El correo electrónico es obligatorio"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "El correo electrónico no es válido"
    if (!password) newErrors.password = "La contraseña es obligatoria"
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

    const result = await login(email, password)
    if (result.ok) {
      if (result.rol === 'admin') {
        navigate("/admin/dashboard", { replace: true })
      } else {
        navigate("/dashboard", { replace: true })
      }
    } else {
      // Manejar errores del backend
      if (result.fieldErrors) {
        // Errores de validación específicos por campo
        setErrors(result.fieldErrors)
      } else if (typeof result.error === 'string') {
        // Error general
        setErrors({ general: result.error })
      } else {
        setErrors({ general: "Error desconocido al iniciar sesión." })
      }
    }

    setLoading(false)
  }

  if (!isAuthChecked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/50">
        <div className="text-center">
          <span className="text-gray-500">Verificando sesión...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Inicia Sesión</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && <FormError message={errors.general} />}            <div className="space-y-1">
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

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Iniciando sesión..." : "Login"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground text-center">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-primary underline-offset-4 hover:underline font-medium">
              Regístrate
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

export default Login
