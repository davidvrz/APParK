import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { generateAccessToken, generateRefreshToken, verifyToken } from '../libs/jwt.js'

export const register = async (req, res) => {
  try {
    const { email, password, nombreCompleto, telefono, rol } = req.body

    // Verifica si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' })
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el usuario
    const newUser = await User.create({
      email,
      password_hash: hashedPassword,
      nombreCompleto,
      telefono,
      rol
    })

    // Generar el access token y refresh token
    const { token: accessToken, expiresIn: accessTokenExpiresIn } = generateAccessToken({
      id: newUser.id,
      email: newUser.email,
      rol: newUser.rol
    })

    const { token: refreshToken } = generateRefreshToken({
      id: newUser.id
    })

    // Configurar cookies seguras con el refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // CAMBIAR A true EN PRODUCCIÓN
      sameSite: 'Strict',
      path: '/api/auth/refresh' // La cookie solo se enviará a esta ruta
    })

    // Responder con el access token
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      accessToken: {
        token: accessToken,
        expiresIn: accessTokenExpiresIn
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar el usuario
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash)
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' })
    }

    // Generar tokens
    const { token: accessToken, expiresIn: accessTokenExpiresIn } = generateAccessToken({
      id: user.id,
      email: user.email,
      rol: user.rol
    })

    const { token: refreshToken } = generateRefreshToken({
      id: user.id
    })

    // Configurar cookie segura con el refresh token
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false, // CAMBIAR A true EN PRODUCCIÓN
      sameSite: 'Strict',
      path: '/api/auth/refresh'
    })

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      accessToken: {
        token: accessToken,
        expiresIn: accessTokenExpiresIn
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const refreshAccessToken = (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    // Verifica el refresh token
    const decoded = verifyToken(refreshToken)

    // Genera un nuevo access token
    const { token: newAccessToken, expiresIn } = generateAccessToken({
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol
    })

    res.status(200).json({
      accessToken: {
        token: newAccessToken,
        expiresIn
      }
    })
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expirado' })
    }
    return res.status(403).json({ error: 'Refresh token inválido' })
  }
}

export const logout = (req, res) => {
  try {
    // Eliminar la cookie con el refresh token
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false, // CAMBIAR A true EN PRODUCCIÓN
      sameSite: 'Strict',
      path: '/api/auth/refresh'
    })

    res.status(200).json({ message: 'Sesión cerrada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
