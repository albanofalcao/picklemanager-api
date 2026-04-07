import { Router } from 'express';
import { login, trocarSenha } from '../services/authService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const authRoutes = Router();

authRoutes.post('/login', async (req, res) => {
  try {
    const resultado = await login(req.body.email, req.body.senha);
    res.json(resultado);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

authRoutes.post('/trocar-senha', authMiddleware, async (req, res) => {
  try {
    await trocarSenha(req.userId, req.body.senhaAtual, req.body.novaSenha);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

authRoutes.get('/me', authMiddleware, (req, res) => {
  res.json({ userId: req.userId, arenaId: req.arenaId, role: req.role });
});