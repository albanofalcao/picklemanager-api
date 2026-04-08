import { Router } from 'express';
import { login, trocarSenha } from '../services/authService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export const authRoutes = Router();

authRoutes.post('/login', async function(req, res) {
  try {
    var resultado = await login(req.body.email, req.body.senha);
    res.json(resultado);
  } catch(e) {
    res.status(401).json({ error: e.message });
  }
});

authRoutes.post('/trocar-senha', authMiddleware, async function(req, res) {
  try {
    await trocarSenha(req.userId, req.body.senhaAtual, req.body.novaSenha);
    res.json({ ok: true });
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});

authRoutes.get('/me', authMiddleware, function(req, res) {
  res.json({ userId: req.userId, arenaId: req.arenaId, role: req.role });
});
