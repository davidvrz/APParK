import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import AuthFormWrapper from '../components/forms/AuthFormWrapper'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import FormError from '../components/ui/FormError'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Por favor, completa todos los campos')
      return
    }

    const result = await login(email, password)
    if (result.ok) navigate('/dashboard')
    else setError(result.error)
  }

  return (
    <AuthFormWrapper title="Inicia sesión">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormError message={error} />

        <label className="block text-sm font-medium text-dark">Correo electrónico</label>
        <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ejemplo@correo.com" />

        <label className="block text-sm font-medium text-dark">Contraseña</label>
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

        <Button type="submit">Entrar</Button>
      </form>

      <p className="text-sm mt-4 text-center text-grayText">
        ¿No tienes cuenta?{' '}
        <a href="/register" className="text-primary hover:underline font-medium">
          Regístrate
        </a>
      </p>
    </AuthFormWrapper>
  )
}

export default Login
