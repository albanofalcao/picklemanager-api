import express from 'express';
import { dbAdmin } from '../db/connection.js';

export const adminRoutes = express.Router();

adminRoutes.get('/status', (req, res) => {
  res.json({ status: 'admin ok' });
});

adminRoutes.get('/setup', async (req, res) => {
  try {
    await dbAdmin.raw('ALTER TABLE grupos_economicos DISABLE ROW LEVEL SECURITY');
    await dbAdmin.raw('ALTER TABLE arenas DISABLE ROW LEVEL SECURITY');
    await dbAdmin.raw('ALTER TABLE arena_responsaveis DISABLE ROW LEVEL SECURITY');
    await dbAdmin.raw('ALTER TABLE arena_quadras DISABLE ROW LEVEL SECURITY');
    res.json({ message: 'RLS desabilitado com sucesso' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
