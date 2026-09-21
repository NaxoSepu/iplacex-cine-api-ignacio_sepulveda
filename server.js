import express from 'express';
import cors from 'cors';
import client from './src/common/db.js';
import peliculaRoutes from './src/pelicula/routes.js';
import ActorRoutes from './src/actor/routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.status(200).send('Bienvenido al cine Iplacex');
});

app.use('/api', peliculaRoutes);
app.use('/api', ActorRoutes);

await client.connect()
  .then(() => {
    console.log('Conexión exitosa al clúster de MongoDB Atlas');
    
    app.listen(PORT, () => {
      console.log(`Servidor Express escuchando en el puerto: ${PORT}`);
      console.log(`URL de prueba: http://localhost:${PORT}/`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB Atlas:', error.message);
    process.exit(1);
  });