import express from 'express';
import controller from './controller.js';

const ActorRoutes = express.Router();

ActorRoutes.post('/actor', controller.handleInsertActorRequest);
ActorRoutes.get('/actores', controller.handleGetActoresRequest);
ActorRoutes.get('/actor/:id', controller.handleGetActorByIdRequest);
ActorRoutes.get('/actor/:pelicula', controller.handleGetActoresByPeliculaIdRequest);

export default ActorRoutes;