import express from 'express';

export const arenaRoutes = express.Router();

arenaRoutes.get('/', (req, res) => {
  res.json({ status: 'arenas ok' });
});
