import cors from 'cors';

const ACCEPTED_ORIGINS = [
  'http://localhost:8080',
  'http://localhost:3000',
  'https://movies-app-frontend.vercel.app',
  'https://movies-app-frontend-git-main-davidalmonacid.vercel.app'
];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    }
  });
};
