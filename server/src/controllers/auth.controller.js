import bcrypt from 'bcryptjs'
import User from '../models/user.model.js'
import { generateAccessToken, generateRefreshToken, verifyUserToken } from '../libs/jwt.js'
import pick from 'lodash/pick.js'

export const register = async (req, res) => {
  try {
    const { email, password, nombreCompleto, telefono } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await User.create({
      email,
      hashedPassword,
      nombreCompleto,
      telefono,
      rol: 'conductor'
    })

    const { token: accessToken, expiresIn: accessTokenExpiresIn } = generateAccessToken({
      id: newUser.id,
      nombreCompleto: newUser.nombreCompleto,
      email: newUser.email,
      rol: newUser.rol
    })

    const { token: refreshToken } = generateRefreshToken({
      id: newUser.id
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true en producción, false en desarrollo
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      path: '/api/auth/refresh', // La cookie solo se enviará a esta ruta
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días en millisegundos
    })

    const createdUser = pick(newUser.get(), ['id', 'email', 'nombreCompleto', 'telefono', 'rol'])

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: createdUser,
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

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'El correo electrónico no está registrado' })
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword)
    if (!isMatch) {
      return res.status(401).json({ error: 'La contraseña es incorrecta' })
    }

    const { token: accessToken, expiresIn: accessTokenExpiresIn } = generateAccessToken({
      id: user.id,
      nombreCompleto: user.nombreCompleto,
      email: user.email,
      rol: user.rol
    })

    const { token: refreshToken } = generateRefreshToken({
      id: user.id
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true en producción, false en desarrollo
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días en millisegundos
    })

    const loggedUser = pick(user.get(), ['id', 'email', 'nombreCompleto', 'telefono', 'rol'])

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: loggedUser,
      accessToken: {
        token: accessToken,
        expiresIn: accessTokenExpiresIn
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const decoded = verifyUserToken(refreshToken)

    const user = await User.findByPk(decoded.id)
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' })
    }

    const { token: newAccessToken, expiresIn } = generateAccessToken({
      id: user.id,
      nombreCompleto: user.nombreCompleto,
      email: user.email,
      rol: user.rol
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
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // true en producción, false en desarrollo
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Strict',
      path: '/api/auth/refresh'
    })

    res.status(200).json({ message: 'Sesión cerrada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
