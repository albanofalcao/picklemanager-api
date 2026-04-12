import express from 'express';
import { db } from '../db/connection.js';

export const arenaRoutes = express.Router();

// Listar todas as arenas
arenaRoutes.get('/', async (req, res) => {
  try {
    const arenas = await db('arenas')
      .leftJoin('grupos_economicos', 'arenas.grupo_economico_id', 'grupos_economicos.id')
      .select(
        'arenas.*',
        'grupos_economicos.nome as grupo_nome'
      )
      .orderBy('arenas.nome');
    res.json(arenas);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Buscar arena por id
arenaRoutes.get('/:id', async (req, res) => {
  try {
    const arena = await db('arenas').where('arenas.id', req.params.id).first();
    if (!arena) return res.status(404).json({ error: 'Arena não encontrada' });
    const responsaveis = awai
