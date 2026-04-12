import express from 'express';
import { dbAdmin } from '../db/connection.js';
import { up as up001 } from '../db/migrations/001_create_groups.js';
import { up as up002 } from '../db/migrations/002_create_arenas.js';
import { up as up003 } from '../db/migrations/003_create_arena_responsaveis.js';
import { up as up004 } from '../db/migrations/004_create_arena_quadras.js';

export const adminRoutes = express.Router();

adminRoutes.get('/status', (req, res) => {
  res.json({ status: 'admin ok' });
});

adminRoutes.get('/debug', (req, res) => {
  const url = process.env.DATABASE_ADMIN_URL || 'NAO DEFINIDA';
  const host = url.split('@')[1]?.split(':')[0] || 'sem host';
  res.json({ host });
});

adminRoutes.get('/migrate', async (req, res) => {
  try {
    await up001(dbAdmin);
    await up002(dbAdmin);
    await up003(dbAdmin);
    await up004(dbAdmin);
    await dbAdmin.raw('ALTER TABLE grupos_economicos DISABLE ROW LEVEL SECURITY');
    await dbAdmin.raw('ALTER TABLE arenas DISABLE ROW LEVEL SECURITY');
    await dbAdmin.raw('ALTER TABLE arena_responsaveis DISABLE ROW LEVEL SECURITY');
    await dbAdmin.raw('ALTER TABLE arena_quadras DISABLE ROW LEVEL SECURITY');
    res.json({ message: 'Migrations e RLS OK' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
