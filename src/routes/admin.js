import express from 'express';
import { db } from '../db/connection.js';

export const adminRoutes = express.Router();

adminRoutes.get('/status', (req, res) => {
  res.json({ status: 'admin ok' });
});

adminRoutes.post('/setup', async (req, res) => {
  try {
    await db.raw('ALTER TABLE grupos_economicos DISABLE ROW LEVEL SECURITY');
    await db.raw('ALTER TABLE arenas DISABLE ROW LEVEL SECURITY');
    await db.raw('ALTER TABLE arena_responsaveis DISABLE ROW LEVEL SECURITY');
    await db.raw('ALTER TABLE arena_quadras DISABLE ROW LEVEL SECURITY');
    res.json({ message: 'RLS desabilitado com sucesso' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
