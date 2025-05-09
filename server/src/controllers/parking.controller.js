import Parking from '../models/parking.model.js'
import Planta from '../models/planta.model.js'
import Plaza from '../models/plaza.model.js'
import Anuncio from '../models/anuncio.model.js'

import pick from 'lodash/pick.js'
import { sequelize } from '../database/db.js'
import { generateParkingToken } from '../libs/jwt.js'

export const getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.findAll({
      attributes: ['id', 'nombre', 'ubicacion', 'latitud', 'longitud', 'capacidad', 'estado']
    })

    // Incluir todos los atributos necesarios, incluyendo capacidad y estado
    const formattedParkings = parkings.map(parking =>
      pick(parking.get(), ['id', 'nombre', 'ubicacion', 'latitud', 'longitud', 'capacidad', 'estado'])
    )

    res.status(200).json({ parkings: formattedParkings })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getParkingById = async (req, res) => {
  try {
    const { parkingId } = req.params

    const parking = await Parking.findByPk(parkingId, {
      include: {
        model: Planta,
        as: 'plantas',
        include: {
          model: Plaza,
          as: 'plazas',
          attributes: ['id', 'numero', 'reservable', 'tipo', 'estado', 'precioHora']
        }
      }
    })

    if (!parking) {
      return res.status(404).json({ error: 'Parking no encontrado' })
    }

    let plazasLibres = 0
    let plazasOcupadas = 0
    let plazasReservadas = 0

    parking.plantas.forEach(planta => {
      planta.plazas.forEach(plaza => {
        if (plaza.estado === 'Libre') plazasLibres++
        if (plaza.estado === 'Ocupado') plazasOcupadas++
        if (plaza.estado === 'Reservado') plazasReservadas++
      })
    })

    const formattedParking = {
      ...pick(parking.get(), ['id', 'nombre', 'ubicacion', 'latitud', 'longitud', 'capacidad', 'estado']),
      plantas: parking.plantas.map(planta => ({
        id: planta.id,
        numero: planta.numero,
        plazas: planta.plazas.map(plaza =>
          pick(plaza.get(), ['id', 'numero', 'reservable', 'tipo', 'estado', 'precioHora'])
        )
      })),
      plazasLibres,
      plazasOcupadas,
      plazasReservadas
    }

    res.status(200).json({ parking: formattedParking })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPlantaById = async (req, res) => {
  try {
    const { parkingId, plantaId } = req.params

    const planta = await Planta.findOne({
      where: {
        id: plantaId,
        parking_id: parkingId
      },
      include: {
        model: Plaza,
        as: 'plazas',
        attributes: ['id', 'numero']
      }
    })

    if (!planta) {
      return res.status(404).json({ error: 'Planta no encontrada' })
    }

    const formattedPlanta = {
      ...pick(planta.get(), ['id', 'numero']),
      plazas: planta.plazas.map(plaza =>
        pick(plaza.get(), ['id', 'numero'])
      )
    }

    res.status(200).json({ planta: formattedPlanta })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getPlazaById = async (req, res) => {
  try {
    const { plantaId, plazaId } = req.params

    const plaza = await Plaza.findOne({
      where: {
        id: plazaId,
        planta_id: plantaId
      }
    })

    if (!plaza) {
      return res.status(404).json({ error: 'Plaza no encontrada' })
    }

    const formattedPlaza = pick(plaza.get(), ['id', 'numero', 'reservable', 'tipo', 'estado', 'precioHora'])

    res.status(200).json({ plaza: formattedPlaza })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createParking = async (req, res) => {
  const transaction = await sequelize.transaction()

  try {
    const { nombre, ubicacion, latitud, longitud, capacidad, estado, plantas } = req.body

    const parking = await Parking.create(
      { nombre, ubicacion, latitud, longitud, capacidad, estado },
      { transaction }
    )

    let createdParking = pick(parking.get(), ['id', 'nombre', 'ubicacion', 'latitud', 'longitud', 'capacidad', 'estado'])

    if (plantas && plantas.length > 0) {
      const createdPlantas = await Promise.all(
        plantas.map(async (planta) => {
          const nuevaPlanta = await Planta.create(
            {
              parking_id: parking.id,
              numero: planta.numero
            },
            { transaction }
          )

          let plazasCreadas = []
          if (planta.plazas && planta.plazas.length > 0) {
            plazasCreadas = await Promise.all(
              planta.plazas.map(async (plaza) => {
                const nuevaPlaza = await Plaza.create(
                  {
                    planta_id: nuevaPlanta.id,
                    numero: plaza.numero,
                    tipo: plaza.tipo,
                    estado: plaza.estado ?? 'Libre',
                    precioHora: plaza.precioHora,
                    reservable: plaza.reservable ?? true
                  },
                  { transaction }
                )

                return pick(nuevaPlaza.get(), ['id', 'numero', 'reservable', 'tipo', 'estado', 'precioHora'])
              })
            )
          }

          return {
            id: nuevaPlanta.id,
            numero: nuevaPlanta.numero,
            plazas: plazasCreadas
          }
        })
      )

      createdParking = {
        ...createdParking,
        plantas: createdPlantas
      }
    }

    const parkingToken = generateParkingToken({
      parkingId: parking.id,
      nombre: parking.nombre
    })

    await transaction.commit()

    res.status(201).json({
      parking: createdParking,
      parkingToken
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
}

export const updateParking = async (req, res) => {
  try {
    const { parkingId } = req.params
    const { nombre, ubicacion, latitud, longitud, capacidad, estado } = req.body

    const parking = await Parking.findByPk(parkingId)

    if (!parking) {
      return res.status(404).json({ error: 'Parking no encontrado' })
    }

    parking.nombre = nombre ?? parking.nombre
    parking.ubicacion = ubicacion ?? parking.ubicacion
    parking.latitud = latitud ?? parking.latitud
    parking.longitud = longitud ?? parking.longitud
    parking.capacidad = capacidad ?? parking.capacidad
    parking.estado = estado ?? parking.estado

    await parking.save()

    const updatedParking = pick(parking.get(), ['id', 'nombre', 'ubicacion', 'latitud', 'longitud', 'capacidad', 'estado'])

    res.status(200).json({ message: 'Parking actualizado correctamente', parking: updatedParking })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteParking = async (req, res) => {
  try {
    const { parkingId } = req.params

    const deleted = await Parking.destroy({ where: { id: parkingId } })

    if (!deleted) {
      return res.status(404).json({ error: 'Parking no encontrado' })
    }

    res.status(200).json({ message: 'Parking eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createPlanta = async (req, res) => {
  try {
    const { parkingId } = req.params
    const { numero } = req.body

    const planta = await Planta.create({ parking_id: parkingId, numero })

    const createdPlanta = pick(planta.get(), ['id', 'parking_id', 'numero'])

    res.status(201).json({ planta: createdPlanta })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deletePlanta = async (req, res) => {
  try {
    const { parkingId, plantaId } = req.params

    const deleted = await Planta.destroy({ where: { id: plantaId, parking_id: parkingId } })

    if (!deleted) {
      return res.status(404).json({ error: 'Planta no encontrada en este parking' })
    }

    res.status(200).json({ message: 'Planta eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createPlaza = async (req, res) => {
  try {
    const { plantaId } = req.params
    const { numero, reservable, tipo, estado, precioHora } = req.body

    const plaza = await Plaza.create({
      planta_id: plantaId,
      numero,
      reservable,
      tipo,
      estado,
      precioHora
    })

    const createdPlaza = pick(plaza.get(), ['id', 'planta_id', 'numero', 'reservable', 'tipo', 'estado', 'precioHora'])

    res.status(201).json({ plaza: createdPlaza })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updatePlaza = async (req, res) => {
  try {
    const { plantaId, plazaId } = req.params
    const { numero, reservable, tipo, estado, precioHora } = req.body

    const plaza = await Plaza.findOne({ where: { id: plazaId, planta_id: plantaId } })

    if (!plaza) {
      return res.status(404).json({ error: 'Plaza no encontrada en esta planta' })
    }

    plaza.numero = numero ?? plaza.numero
    plaza.reservable = reservable ?? plaza.reservable
    plaza.tipo = tipo ?? plaza.tipo
    plaza.estado = estado ?? plaza.estado
    plaza.precioHora = precioHora ?? plaza.precioHora

    await plaza.save()

    const updatedPlaza = pick(plaza.get(), ['id', 'planta_id', 'numero', 'reservable', 'tipo', 'estado', 'precioHora'])

    res.status(200).json({ message: 'Plaza actualizada correctamente', plaza: updatedPlaza })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deletePlaza = async (req, res) => {
  try {
    const { plantaId, plazaId } = req.params

    const deleted = await Plaza.destroy({ where: { id: plazaId, planta_id: plantaId } })

    if (!deleted) {
      return res.status(404).json({ error: 'Plaza no encontrada en esta planta' })
    }

    res.status(200).json({ message: 'Plaza eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getAnunciosByParkingId = async (req, res) => {
  try {
    const { parkingId } = req.params

    const anuncios = await Anuncio.findAll({ where: { parking_id: parkingId } })

    const formatted = anuncios.map(anuncio =>
      pick(anuncio.get(), ['id', 'parking_id', 'contenido', 'created_at', 'updated_at'])
    )

    res.status(200).json({ anuncios: formatted })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createAnuncio = async (req, res) => {
  try {
    const { parkingId } = req.params
    const { contenido } = req.body

    const anuncio = await Anuncio.create({
      parking_id: parkingId,
      contenido
    })

    const createdAnuncio = pick(anuncio.get(), ['id', 'parking_id', 'contenido', 'created_at', 'updated_at'])

    res.status(201).json({ anuncio: createdAnuncio })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updateAnuncio = async (req, res) => {
  try {
    const { parkingId, id } = req.params
    const { contenido } = req.body

    const anuncio = await Anuncio.findOne({ where: { id, parking_id: parkingId } })

    if (!anuncio) {
      return res.status(404).json({ error: 'Anuncio no encontrado para este parking' })
    }

    anuncio.contenido = contenido ?? anuncio.contenido
    await anuncio.save()

    const updatedAnuncio = pick(anuncio.get(), ['id', 'parking_id', 'contenido', 'created_at', 'updated_at'])

    res.status(200).json({ message: 'Anuncio actualizado correctamente', anuncio: updatedAnuncio })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const deleteAnuncio = async (req, res) => {
  try {
    const { parkingId, id } = req.params

    const deleted = await Anuncio.destroy({ where: { id, parking_id: parkingId } })

    if (!deleted) {
      return res.status(404).json({ error: 'Anuncio no encontrado para este parking' })
    }

    res.status(200).json({ message: 'Anuncio eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
