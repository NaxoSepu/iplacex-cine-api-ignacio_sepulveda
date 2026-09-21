import { ObjectId } from 'mongodb';
import client from '../common/db.js';
import { Actor } from './actor.js';

const actorCollection = client.db('cine-db').collection('actores');
const peliculaCollection = client.db('cine-db').collection('peliculas');

function parseObjectId(idString) {
  const cleanId = String(idString || '').trim();
  if (!cleanId || cleanId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(cleanId)) {
    throw new Error('Id mal formado');
  }
  return ObjectId.createFromHexString(cleanId);
}

async function handleInsertActorRequest(req, res) {
  try {
    const body = req.body;

    return await peliculaCollection.findOne({ nombre: body.nombrePelicula || body.pelicula })
      .then(async (peliculaEncontrada) => {
        if (!peliculaEncontrada) {
          return res.status(404).json({ error: 'La película especificada no existe en la colección de películas' });
        }

        const actor = new Actor(
          peliculaEncontrada._id.toString(),
          body.nombre,
          body.edad,
          body.estaRetirado,
          body.premios
        );

        return await actorCollection.insertOne(actor)
          .then((data) => {
            if (!data || !data.insertedId) {
              return res.status(400).json({ error: 'No fue posible registrar el actor' });
            }
            return res.status(201).json({
              message: 'Actor registrado exitosamente',
              insertedId: data.insertedId
            });
          })
          .catch((e) => res.status(500).json({ error: e.message }));
      })
      .catch((dbErr) => res.status(500).json({ error: dbErr.message }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleGetActoresRequest(req, res) {
  try {
    return await actorCollection.find().toArray()
      .then((data) => res.status(200).json(data))
      .catch((e) => res.status(500).json({ error: e.message }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleGetActorByIdRequest(req, res) {
  const param = req.params.id || req.params.pelicula;
  let oid;

  try {
    oid = parseObjectId(param);
  } catch (err) {
    return res.status(400).json({ error: 'Id mal formado' });
  }

  try {
    return await actorCollection.findOne({ _id: oid })
      .then(async (actor) => {
        if (actor) {
          return res.status(200).json(actor);
        }

        return await actorCollection.find({ idPelicula: String(param).trim() }).toArray()
          .then((actoresPorPelicula) => {
            if (actoresPorPelicula.length > 0) {
              return res.status(200).json(actoresPorPelicula);
            }
            return res.status(404).json({ error: 'Actor o película no encontrada' });
          })
          .catch((e) => res.status(500).json({ error: e.message }));
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleGetActoresByPeliculaIdRequest(req, res) {
  const idPeliculaParam = String(req.params.pelicula || req.params.id || '').trim();

  try {
    return await actorCollection.find({ idPelicula: idPeliculaParam }).toArray()
      .then((actores) => res.status(200).json(actores))
      .catch((err) => res.status(500).json({ error: err.message }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default {
  handleInsertActorRequest,
  handleGetActoresRequest,
  handleGetActorByIdRequest,
  handleGetActoresByPeliculaIdRequest
};