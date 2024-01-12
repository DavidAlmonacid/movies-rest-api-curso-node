import express from 'express';
import { corsMiddleware } from './middlewares/cors.js';
import { createMovieRouter } from './routes/movies.js';

export function createApp({ movieModel }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json());
  app.use(corsMiddleware());

  app.use('/movies', createMovieRouter({ movieModel }));

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}\n`);
  });
}
