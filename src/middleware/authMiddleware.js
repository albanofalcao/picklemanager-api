import jwt from 'jsonwebtoken';
import { tenantStorage } from './tenantContext.js';

export function authMiddleware(req, res, next) {
  var header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'Token nao fornecido' });
  var token = header.split(' ')[1];
  try {
    var payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    req.arenaId = payload.arenaId || null;
    req.role = payload.role;
    tenantStorage.run({ arenaId: req.arenaId, role: req.role }, next);
  } catch(e) {
    return res.status(401).json({ error: 'Token invalido' });
  }
}

export function requireRole() {
  var roles = Array.from(arguments);
  return function(req, res, next) {
    if (roles.indexOf(req.role) === -1) return res.status(403).json({ error: 'Acesso negado' });
    next();
  };
}
