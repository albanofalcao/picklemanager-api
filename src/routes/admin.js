import { Router } from 'express';
import bcrypt from 'bcrypt';
import { db } from '../db/connection.js';
import { authMiddleware, requireRole } from '../middleware/authMiddleware.js';
import { tenantStorage } from '../middleware/tenantContext.js';

export const adminRoutes = Router();

adminRoutes.use(authMiddleware, requireRole('super_admin'), function(req, res, next) {
  tenantStorage.run({ arenaId: null, role: 'super_admin' }, next);
});

adminRoutes.get('/arenas', async function(req, res) {
  var arenas = await db('arenas').select('*').orderBy('created_at', 'desc');
  res.json(arenas);
});

adminRoutes.post('/arenas', async function(req, res) {
  var b = req.body;
  try {
    var arena = await db('arenas').insert({ nome: b.nome, subdomain: b.subdomain, slug: b.slug, cidade: b.cidade, estado: b.estado, plano: b.plano }).returning('*');
    var hash = await bcrypt.hash(b.gestor_senha, 10);
    var gestor = await db('usuarios').insert({ nome: b.gestor_nome, email: b.gestor_email, senha_hash: hash, arena_id: arena[0].id, role: 'arena_admin', trocar_senha: true }).returning('*');
    res.status(201).json({ arena: arena[0], gestor: gestor[0] });
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});

adminRoutes.get('/usuarios', async function(req, res) {
  var usuarios = await db('usuarios')
    .leftJoin('arenas', 'usuarios.arena_id', 'arenas.id')
    .select('usuarios.id','usuarios.nome','usuarios.email','usuarios.role','usuarios.ativo','arenas.nome as arena_nome')
    .orderBy('usuarios.created_at', 'desc');
  res.json(usuarios);
});

adminRoutes.post('/usuarios/:id/reset-senha', async function(req, res) {
  try {
    var hash = await bcrypt.hash(req.body.nova_senha, 10);
    await db('usuarios').where({ id: req.params.id }).update({ senha_hash: hash, trocar_senha: true });
    res.json({ ok: true });
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});
