import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { BaseRepository } from '../repositories/BaseRepository.js';

export const arenaRoutes = Router();
const repo = new BaseRepository('arenas');

arenaRoutes.get('/', authMiddleware, async (req, res) => {
  try {
    const arenas = await repo.findAll();
    res.json(arenas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});