import Parking from '../models/parking.model.js'
import Planta from '../models/planta.model.js'
import Plaza from '../models/plaza.model.js'
import pick from 'lodash/pick.js'
import { sequelize } from '../database/db.js'

export const getAllParkings = async (req, res) => {
  try {
    const parkings = await Parking.findAll({
      attributes: ['id', 'nombre', 'ubicacion']
    })

    const formattedParkings = parkings.map(parking =>
      pick(parking.get(), ['id', 'nombre', 'ubicacion'])
    )

    res.status(200).json({ parkings: formattedParkings })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const getParkingState = async (req, res) => {
  try {
    const { parkingId } = req.params

    const parking = await Parking.findByPk(parkingId, {
      include: {
        model: Planta,
        as: 'plantas',
        include: {
          model: Plaza,
          as: 'plazas',
          attributes: ['id', 'numero', 'tipo', 'estado', 'precioHora']
        }
      }
    })

    if (!parking) {
      return res.status(404).json({ error: 'Parking no encontrado' })
    }

    // Contar plazas libres, ocupadas y reservadas
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
      ...pick(parking.get(), ['id', 'nombre', 'ubicacion', 'capacidad', 'estado']),
      plantas: parking.plantas.map(planta => ({
        id: planta.id,
        numero: planta.numero,
        plazas: planta.plazas.map(plaza =>
          pick(plaza.get(), ['id', 'numero', 'tipo', 'estado', 'precioHora'])
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

export const getPlantaState = async (req, res) => {
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

export const getPlazaState = async (req, res) => {
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

    const formattedPlaza = pick(plaza.get(), ['id', 'numero', 'tipo', 'estado', 'precioHora'])

    res.status(200).json({ plaza: formattedPlaza })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const createParking = async (req, res) => {
  const transaction = await sequelize.transaction() // 🔥 Iniciamos una transacción

  try {
    const { nombre, ubicacion, capacidad, estado, plantas } = req.body

    // ✅ 1. Crear el parking
    const parking = await Parking.create(
      { nombre, ubicacion, capacidad, estado },
      { transaction }
    )

    let createdParking = pick(parking.get(), ['id', 'nombre', 'ubicacion', 'capacidad', 'estado'])

    // ✅ 2. Si hay plantas definidas, las creamos junto con las plazas
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

          // ✅ Si hay plazas definidas en la planta, las creamos
          if (planta.plazas && planta.plazas.length > 0) {
            await Promise.all(
              planta.plazas.map(async (plaza) => {
                await Plaza.create(
                  {
                    planta_id: nuevaPlanta.id,
                    numero: plaza.numero,
                    tipo: plaza.tipo,
                    estado: plaza.estado ?? 'Libre',
                    precioHora: plaza.precioHora
                  },
                  { transaction }
                )
              })
            )
          }

          return {
            id: nuevaPlanta.id,
            numero: nuevaPlanta.numero,
            plazas: planta.plazas.map((plaza) =>
              pick(plaza, ['numero', 'tipo', 'estado', 'precioHora'])
            )
          }
        })
      )

      // ✅ Agregamos las plantas creadas al objeto de respuesta
      createdParking = {
        ...createdParking,
        plantas: createdPlantas
      }
    }

    // 🔥 Si todo está correcto → Confirmamos la transacción
    await transaction.commit()

    res.status(201).json({ parking: createdParking })
  } catch (error) {
    // 🔥 Si algo falla → Hacemos rollback
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
}

export const updateParking = async (req, res) => {
  try {
    const { parkingId } = req.params
    const { nombre, ubicacion, capacidad, estado } = req.body

    const parking = await Parking.findByPk(parkingId)

    if (!parking) {
      return res.status(404).json({ error: 'Parking no encontrado' })
    }

    parking.nombre = nombre ?? parking.nombre
    parking.ubicacion = ubicacion ?? parking.ubicacion
    parking.capacidad = capacidad ?? parking.capacidad
    parking.estado = estado ?? parking.estado

    await parking.save()

    const updatedParking = pick(parking.get(), ['id', 'nombre', 'ubicacion', 'capacidad', 'estado'])

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
    const { numero, tipo, estado, precioHora } = req.body

    const plaza = await Plaza.create({
      planta_id: plantaId,
      numero,
      tipo,
      estado,
      precioHora
    })

    const createdPlaza = pick(plaza.get(), ['id', 'planta_id', 'numero', 'tipo', 'estado', 'precioHora'])

    res.status(201).json({ plaza: createdPlaza })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const updatePlaza = async (req, res) => {
  try {
    const { plantaId, plazaId } = req.params
    const { numero, tipo, estado, precioHora } = req.body

    const plaza = await Plaza.findOne({ where: { id: plazaId, planta_id: plantaId } })

    if (!plaza) {
      return res.status(404).json({ error: 'Plaza no encontrada en esta planta' })
    }

    plaza.numero = numero ?? plaza.numero
    plaza.tipo = tipo ?? plaza.tipo
    plaza.estado = estado ?? plaza.estado
    plaza.precioHora = precioHora ?? plaza.precioHora

    await plaza.save()

    const updatedPlaza = pick(plaza.get(), ['id', 'planta_id', 'numero', 'tipo', 'estado', 'precioHora'])

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
