import { ObjectId } from 'mongodb';
import client from '../common/db.js';
import { Pelicula } from './pelicula.js';

const peliculaCollection = client.db('cine-db').collection('peliculas');

function parseObjectId(idString) {
  const cleanId = String(idString || '').trim();
  if (!cleanId || cleanId.length !== 24 || !/^[0-9a-fA-F]{24}$/.test(cleanId)) {
    throw new Error('Id mal formado');
  }
  return ObjectId.createFromHexString(cleanId);
}

async function handleInsertPeliculaRequest(req, res) {
  try {
    const body = req.body;
    const pelicula = new Pelicula(body.nombre, body.generos, body.anioEstreno);

    return await peliculaCollection.insertOne(pelicula)
      .then((data) => {
        if (!data || !data.insertedId) {
          return res.status(400).json({ error: 'No fue posible guardar la película' });
        }
        return res.status(201).json({
          message: 'Película creada exitosamente',
          insertedId: data.insertedId
        });
      })
      .catch((e) => res.status(500).json({ error: e.message }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleGetPeliculasRequest(req, res) {
  try {
    return await peliculaCollection.find().toArray()
      .then((data) => res.status(200).json(data))
      .catch((e) => res.status(500).json({ error: e.message }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleGetPeliculaByIdRequest(req, res) {
  let oid;
  try {
    oid = parseObjectId(req.params.id);
  } catch (err) {
    return res.status(400).json({ error: 'Id mal formado' });
  }

  try {
    return await peliculaCollection.findOne({ _id: oid })
      .then((data) => {
        if (!data) {
          return res.status(404).json({ error: 'Película no encontrada' });
        }
        return res.status(200).json(data);
      })
      .catch((e) => res.status(500).json({ error: e.message }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleUpdatePeliculaByIdRequest(req, res) {
  let oid;
  try {
    oid = parseObjectId(req.params.id);
  } catch (err) {
    return res.status(400).json({ error: 'Id mal formado' });
  }

  try {
    const body = req.body;
    const query = {
      $set: {
        nombre: body.nombre,
        generos: body.generos,
        anioEstreno: body.anioEstreno
      }
    };

    return await peliculaCollection.updateOne({ _id: oid }, query)
      .then((data) => {
        if (!data || data.matchedCount === 0) {
          return res.status(404).json({ error: 'Película no encontrada para actualizar' });
        }
        return res.status(200).json({
          message: 'Película actualizada correctamente',
          modifiedCount: data.modifiedCount
        });
      })
      .catch((e) => res.status(500).json({ error: e.message }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

async function handleDeletePeliculaByIdRequest(req, res) {
  let oid;
  try {
    oid = parseObjectId(req.params.id);
  } catch (err) {
    return res.status(400).json({ error: 'Id mal formado' });
  }

  try {
    return await peliculaCollection.deleteOne({ _id: oid })
      .then((data) => {
        if (!data || data.deletedCount === 0) {
          return res.status(404).json({ error: 'Película no encontrada para eliminar' });
        }
        return res.status(200).json({
          message: 'Película eliminada exitosamente',
          deletedCount: data.deletedCount
        });
      })
      .catch((e) => res.status(500).json({ error: e.message }));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export default {
  handleInsertPeliculaRequest,
  handleGetPeliculasRequest,
  handleGetPeliculaByIdRequest,
  handleUpdatePeliculaByIdRequest,
  handleDeletePeliculaByIdRequest
};