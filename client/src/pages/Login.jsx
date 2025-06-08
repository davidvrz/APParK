import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import FormError from "@/components/ui/FormError"

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Por favor, completa todos los campos")
      return
    }

    setLoading(true)
    setError("")

    const result = await login(email, password)
    if (result.ok) navigate("/dashboard")
    else setError(result.error)

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50">
      <Card className="w-full max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Inicia Sesión</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <FormError message={error} />

            <div className="space-y-1">
              <label className="text-sm font-medium">Correo electrónico</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
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
