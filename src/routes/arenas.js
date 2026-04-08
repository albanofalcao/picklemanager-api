import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { BaseRepository } from '../repositories/BaseRepository.js';

export const arenaRoutes = Router();
var repo = new BaseRepository('arenas');

arenaRoutes.get('/', authMiddleware, async function(req, res) {
  try {
    var arenas = await repo.findAll();
    res.json(arenas);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});
