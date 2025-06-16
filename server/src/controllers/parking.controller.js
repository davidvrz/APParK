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
      attributes: ['id', 'nombre', 'ubicacion', 'latitud', 'longitud', 'capacidad', 'estado'],
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

    const formattedParkings = parkings.map(parking => {
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

      return {
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
    })

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

    if (!nombre || !ubicacion || !latitud || !longitud || !capacidad) {
      await transaction.rollback()
      return res.status(400).json({ error: 'Faltan campos requeridos para el parking (nombre, ubicación, latitud, longitud, capacidad)' })
    }

    const parking = await Parking.create(
      {
        nombre,
        ubicacion,
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        capacidad: parseInt(capacidad),
        estado: estado ?? 'Operativo' // Default si no se provee
      },
      { transaction }
    )

    const createdParkingData = pick(parking.get(), ['id', 'nombre', 'ubicacion', 'latitud', 'longitud', 'capacidad', 'estado'])
    const createdPlantasArray = []

    if (plantas && Array.isArray(plantas) && plantas.length > 0) {
      for (const plantaData of plantas) {
        if (plantaData.numero === undefined || plantaData.numero === null) {
          // Opcional: registrar advertencia o lanzar error. Por ahora, omitimos la planta.
          console.warn(`Número de planta no proporcionado para parking ${parking.id}. Omitiendo esta planta.`)
          continue
        }
        const nuevaPlanta = await Planta.create(
          {
            parking_id: parking.id,
            numero: plantaData.numero
          },
          { transaction }
        )

        const plazasCreadasArray = []
        if (plantaData.plazas && Array.isArray(plantaData.plazas) && plantaData.plazas.length > 0) {
          for (const plazaData of plantaData.plazas) {
            if (plazaData.numero === undefined || plazaData.numero === null || !plazaData.tipo || plazaData.precioHora === undefined || plazaData.precioHora === null) {
              await transaction.rollback()
              return res.status(400).json({ error: `Datos incompletos para la plaza número ${plazaData.numero || '(desconocido)'} en planta ${plantaData.numero}. Se requieren: numero, tipo, precioHora.` })
            }
            const nuevaPlaza = await Plaza.create(
              {
                planta_id: nuevaPlanta.id,
                numero: plazaData.numero,
                tipo: plazaData.tipo,
                estado: plazaData.estado ?? 'Libre',
                precioHora: parseFloat(plazaData.precioHora),
                reservable: plazaData.reservable ?? true
              },
              { transaction }
            )
            plazasCreadasArray.push(pick(nuevaPlaza.get(), ['id', 'numero', 'reservable', 'tipo', 'estado', 'precioHora']))
          }
        }
        createdPlantasArray.push({
          ...pick(nuevaPlanta.get(), ['id', 'numero']),
          plazas: plazasCreadasArray
        })
      }
    }
    createdParkingData.plantas = createdPlantasArray

    let plazasLibres = 0
    let plazasOcupadas = 0
    let plazasReservadas = 0

    createdParkingData.plantas.forEach(planta => {
      planta.plazas.forEach(plaza => {
        if (plaza.estado === 'Libre' && plaza.reservable) plazasLibres++
        else if (plaza.estado === 'Ocupada') plazasOcupadas++
        else if (plaza.estado === 'Reservada') plazasReservadas++
      })
    })

    createdParkingData.plazasLibres = plazasLibres
    createdParkingData.plazasOcupadas = plazasOcupadas
    createdParkingData.plazasReservadas = plazasReservadas

    const parkingToken = generateParkingToken({
      parkingId: parking.id,
      nombre: parking.nombre
    })

    await transaction.commit()

    res.status(201).json({
      message: 'Parking creado correctamente',
      parking: createdParkingData,
      parkingToken
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({ error: error.message })
  }
}

export const updateParking = async (req, res) => {
  const transaction = await sequelize.transaction()
  try {
    const { parkingId } = req.params
    const { nombre, ubicacion, latitud, longitud, capacidad, estado, plantas: incomingPlantas } = req.body

    const parking = await Parking.findByPk(parkingId, { transaction })

    if (!parking) {
      await transaction.rollback()
      return res.status(404).json({ error: 'Parking no encontrado' })
    }

    // Actualizar propiedades directas del Parking
    parking.nombre = nombre ?? parking.nombre
    parking.ubicacion = ubicacion ?? parking.ubicacion
    parking.latitud = latitud ?? parking.latitud
    parking.longitud = longitud ?? parking.longitud
    parking.capacidad = capacidad ?? parking.capacidad
    parking.estado = estado ?? parking.estado
    await parking.save({ transaction })

    // Manejar Plantas y Plazas
    if (incomingPlantas && Array.isArray(incomingPlantas)) {
      const existingPlantas = await Planta.findAll({
        where: { parking_id: parkingId },
        transaction
      })
      const incomingPlantaIds = incomingPlantas.map(p => p.id).filter(id => id)

      // Eliminar plantas (y sus plazas) que no están en la solicitud
      for (const existingPlanta of existingPlantas) {
        if (!incomingPlantaIds.includes(existingPlanta.id)) {
          await Plaza.destroy({ where: { planta_id: existingPlanta.id }, transaction })
          await existingPlanta.destroy({ transaction })
        }
      }

      // Actualizar plantas existentes o crear nuevas
      for (const incomingPlanta of incomingPlantas) {
        let plantaInstance
        if (incomingPlanta.id) {
          plantaInstance = await Planta.findOne({ where: { id: incomingPlanta.id, parking_id: parkingId }, transaction })
          if (plantaInstance) {
            plantaInstance.numero = incomingPlanta.numero ?? plantaInstance.numero
            await plantaInstance.save({ transaction })
          } else {
            console.warn(`Planta con ID ${incomingPlanta.id} no encontrada para parking ${parkingId}. Omitiendo.`)
            continue
          }
        } else {
          plantaInstance = await Planta.create({
            parking_id: parkingId,
            numero: incomingPlanta.numero
          }, { transaction })
        }

        // Manejar Plazas para la plantaInstance actual
        if (plantaInstance && incomingPlanta.plazas && Array.isArray(incomingPlanta.plazas)) {
          const existingPlazasForPlanta = await Plaza.findAll({ where: { planta_id: plantaInstance.id }, transaction })
          const incomingPlazaIdsForPlanta = incomingPlanta.plazas.map(p => p.id).filter(id => id)

          for (const existingPlaza of existingPlazasForPlanta) {
            if (!incomingPlazaIdsForPlanta.includes(existingPlaza.id)) {
              await existingPlaza.destroy({ transaction })
            }
          }

          for (const incomingPlaza of incomingPlanta.plazas) {
            if (incomingPlaza.id) {
              const plazaToUpdate = await Plaza.findOne({ where: { id: incomingPlaza.id, planta_id: plantaInstance.id }, transaction })
              if (plazaToUpdate) {
                plazaToUpdate.numero = incomingPlaza.numero ?? plazaToUpdate.numero
                plazaToUpdate.tipo = incomingPlaza.tipo ?? plazaToUpdate.tipo
                plazaToUpdate.estado = incomingPlaza.estado ?? plazaToUpdate.estado
                plazaToUpdate.reservable = typeof incomingPlaza.reservable === 'boolean' ? incomingPlaza.reservable : plazaToUpdate.reservable
                if (incomingPlaza.precioHora !== undefined) {
                  plazaToUpdate.precioHora = incomingPlaza.precioHora === null ? null : parseFloat(incomingPlaza.precioHora)
                }
                await plazaToUpdate.save({ transaction })
              } else {
                console.warn(`Plaza con ID ${incomingPlaza.id} no encontrada para planta ${plantaInstance.id}. Omitiendo.`)
              }
            } else {
              if (incomingPlaza.numero === undefined || incomingPlaza.numero === null || !incomingPlaza.tipo || incomingPlaza.precioHora === undefined || incomingPlaza.precioHora === null) {
                throw new Error(`Datos incompletos para la nueva plaza número ${incomingPlaza.numero || '(desconocido)'} en planta ${plantaInstance.numero}. Se requieren: numero, tipo, precioHora.`)
              }
              await Plaza.create({
                planta_id: plantaInstance.id,
                numero: incomingPlaza.numero,
                tipo: incomingPlaza.tipo,
                estado: incomingPlaza.estado ?? 'Libre',
                reservable: incomingPlaza.reservable ?? true,
                precioHora: parseFloat(incomingPlaza.precioHora)
              }, { transaction })
            }
          }
        }
      }
    }

    await transaction.commit()

    const updatedParkingWithDetails = await Parking.findByPk(parkingId, {
      include: {
        model: Planta,
        as: 'plantas',
        order: [['numero', 'ASC']],
        include: {
          model: Plaza,
          as: 'plazas',
          order: [['numero', 'ASC']]
        }
      }
    })

    let plazasLibres = 0
    let plazasOcupadas = 0
    let plazasReservadas = 0

    if (updatedParkingWithDetails && updatedParkingWithDetails.plantas) {
      updatedParkingWithDetails.plantas.forEach(planta => {
        if (planta.plazas) {
          planta.plazas.forEach(plaza => {
            if (plaza.estado === 'Libre' && plaza.reservable) plazasLibres++
            else if (plaza.estado === 'Ocupada') plazasOcupadas++
            else if (plaza.estado === 'Reservada') plazasReservadas++
          })
        }
      })
    }

    const formattedParking = {
      ...(updatedParkingWithDetails ? pick(updatedParkingWithDetails.get(), ['id', 'nombre', 'ubicacion', 'latitud', 'longitud', 'capacidad', 'estado']) : {}),
      plantas: updatedParkingWithDetails && updatedParkingWithDetails.plantas
        ? updatedParkingWithDetails.plantas.map(planta => ({
          ...pick(planta.get(), ['id', 'numero']),
          plazas: planta.plazas
            ? planta.plazas.map(plaza =>
              pick(plaza.get(), ['id', 'numero', 'reservable', 'tipo', 'estado', 'precioHora'])
            )
            : []
        }))
        : [],
      plazasLibres,
      plazasOcupadas,
      plazasReservadas
    }

    res.status(200).json({ message: 'Parking actualizado correctamente', parking: formattedParking })
  } catch (error) {
    if (transaction && transaction.sequelize && transaction.finished !== 'commit' && transaction.finished !== 'rollback') {
      await transaction.rollback()
    }
    console.error('Error al actualizar parking:', error)
    res.status(500).json({ error: 'Error interno al actualizar el parking: ' + error.message })
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
