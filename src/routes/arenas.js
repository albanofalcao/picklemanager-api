import express from 'express';
import { dbAdmin as db } from '../db/connection.js';

export const arenaRoutes = express.Router();

arenaRoutes.get('/', async (req, res) => {
  try {
    const arenas = await db('arenas')
      .leftJoin('grupos_economicos', 'arenas.grupo_economico_id', 'grupos_economicos.id')
      .select('arenas.*', 'grupos_economicos.nome as grupo_nome')
      .orderBy('arenas.nome');
    res.json(arenas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

arenaRoutes.get('/:id', async (req, res) => {
  try {
    const arena = await db('arenas').where('arenas.id', req.params.id).first();
    if (!arena) return res.status(404).json({ error: 'Arena nao encontrada' });
    const responsaveis = await db('arena_responsaveis').where('arena_id', arena.id);
    const quadras = await db('arena_quadras').where('arena_id', arena.id);
    res.json({ ...arena, responsaveis, quadras });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
arenaRoutes.post('/', async (req, res) => {
  try {
    const { responsaveis, quadras, ...dadosArena } = req.body;
    const [arena] = await db('arenas').insert(dadosArena).returning('*');
    if (responsaveis?.length) {
      await db('arena_responsaveis').insert(responsaveis.map(r => ({ ...r, arena_id: arena.id })));
    }
    if (quadras?.length) {
      await db('arena_quadras').insert(quadras.map(q => ({ ...q, arena_id: arena.id })));
    }
    res.status(201).json(arena);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

arenaRoutes.put('/:id', async (req, res) => {
  try {
    const { responsaveis, quadras, ...dadosArena } = req.body;
    const [arena] = await db('arenas').where('id', req.params.id).update(dadosArena).returning('*');
    if (!arena) return res.status(404).json({ error: 'Arena nao encontrada' });
    res.json(arena);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

arenaRoutes.delete('/:id', async (req, res) => {
  try {
    await db('arenas').where('id', req.params.id).delete();
    res.json({ message: 'Arena removida' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
