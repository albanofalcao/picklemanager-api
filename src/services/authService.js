import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../db/connection.js';

export async function login(email, senha) {
  const u = await db('usuarios')
    .where({ email, ativo: true })
    .select('id','arena_id','role','senha_hash','trocar_senha','nome')
    .first();
  if (!u) throw new Error('Credenciais inválidas');
  const ok = await bcrypt.compare(senha, u.senha_hash);
  if (!ok) throw new Error('Credenciais inválidas');
  await db('usuarios').where({ id: u.id }).update({ ultimo_acesso: new Date() });
  const token = jwt.sign(
    { userId: u.id, arenaId: u.arena_id, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
  return {
    token,
    usuario: { id: u.id, nome: u.nome, role: u.role, arenaId: u.arena_id },
    trocarSenha: u.trocar_senha
  };
}

export async function trocarSenha(userId, senhaAtual, novaSenha) {
  const u = await db('usuarios').where({ id: userId }).first();
  const ok = await bcrypt.compare(senhaAtual, u.senha_hash);
  if (!ok) throw new Error('Senha atual incorreta');
  const hash = await bcrypt.hash(novaSenha, 10);
  await db('usuarios').where({ id: userId }).update({ senha_hash: hash, trocar_senha: false });
  return true;
}