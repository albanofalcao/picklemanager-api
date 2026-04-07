import jwt from 'jsonwebtoken';
import { tenantStorage } from './tenantContext.js';

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId  = payload.userId;
    req.arenaId = payload.arenaId ?? null;
    req.role    = payload.role;
    tenantStorage.run({ arenaId: req.arenaId, role: req.role }, next);
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.role)) return res.status(403).json({ error: 'Acesso negado' });
    next();
  };
}