import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import AuthFormWrapper from '../components/forms/AuthFormWrapper'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import FormError from '../components/ui/FormError'

function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!nombre || !email || !password) {
      setError('Todos los campos son obligatorios')
      return
    }

    setLoading(true)
    setError('')

    const result = await register(nombre, email, password)
    if (result.ok) navigate('/dashboard')
    else setError(result.error)

    setLoading(false)
  }

  return (
    <AuthFormWrapper title="Crear cuenta">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormError message={error} />

        <div>
          <label className="text-sm font-medium text-dark">Nombre completo</label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" />
        </div>

        <div>
          <label className="text-sm font-medium text-dark">Correo electrónico</label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" />
        </div>

        <div>
          <label className="text-sm font-medium text-dark">Contraseña</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="transition duration-200 ease-in-out"
        >
          {loading ? 'Registrandose...' : 'Registrarse'}
        </Button>
      </form>

      <p className="text-sm mt-4 text-center text-grayText">
        ¿Ya tienes cuenta?{' '}
        <a href="/login" className="text-primary hover:underline font-medium">
          Inicia sesión
        </a>
      </p>
    </AuthFormWrapper>
  )
}

export default Register
