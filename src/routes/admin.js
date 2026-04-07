import { Router } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db/connection.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';
import { tenantStorage } from '../middleware/tenantContext.js';

export const adminRoutes = Router();

adminRoutes.use(authMiddleware, requireRole('super_admin'), (req, res, next) => {
  tenantStorage.run({ arenaId: null, role: 'super_admin' }, next);
});

adminRoutes.get('/arenas', async (req, res) => {
  const arenas = await db('arenas').select('*').orderBy('created_at', 'desc');
  res.json(arenas);
});

adminRoutes.post('/arenas', async (req, res) => {
  const { nome, subdomain, slug, cidade, estado, plano, gestor_nome, gestor_email, gestor_senha } = req.body;
  try {
    const [arena] = await db('arenas').insert({ nome, subdomain, slug, cidade, estado, plano }).returning('*');
    const hash = await bcrypt.hash(gestor_senha, 10);
    const [gestor] = await db('usuarios')
      .insert({ nome: gestor_nome, email: gestor_email, senha_hash: hash, arena_id: arena.id, role: 'arena_admin', trocar_senha: true })
      .returning('id','nome','email','role');
    res.status(201).json({ arena, gestor });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

adminRoutes.patch('/arenas/:id/status', async (req, res) => {
  const [arena] = await db('arenas').where({ id: req.params.id }).update({ ativo: req.body.ativo }).returning('*');
  res.json(arena);
});

adminRoutes.get('/usuarios', async (req, res) => {
  const usuarios = await db('usuarios')
    .leftJoin('arenas', 'usuarios.arena_id', 'arenas.id')
    .select('usuarios.id','usuarios.nome','usuarios.email','usuarios.role','usuarios.ativo','usuarios.ultimo_acesso','arenas.nome as arena_nome')
    .orderBy('usuarios.created_at', 'desc');
  res.json(usuarios);
});

adminRoutes.post('/usuarios/:id/reset-senha', async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.nova_senha, 10);
    await db('usuarios').where({ id: req.params.id }).update({ senha_hash: hash, trocar_senha: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});