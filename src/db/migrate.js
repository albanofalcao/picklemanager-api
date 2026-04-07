import 'dotenv/config';
import { db } from './connection.js';

async function migrate() {
  console.log('Rodando migrations...');

  await db.schema.createTableIfNotExists('arenas', t => {
    t.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    t.string('nome').notNullable();
    t.string('subdomain').unique().notNullable();
    t.string('slug').unique().notNullable();
    t.string('cidade');
    t.string('estado');
    t.string('plano').defaultTo('basico');
    t.boolean('ativo').defaultTo(true);
    t.boolean('marketplace_ativo').defaultTo(false);
    t.timestamps(true, true);
  });

  await db.schema.createTableIfNotExists('usuarios', t => {
    t.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    t.uuid('arena_id').references('id').inTable('arenas').onDelete('CASCADE').nullable();
    t.string('nome').notNullable();
    t.string('email').unique().notNullable();
    t.string('senha_hash').notNullable();
    t.string('role').defaultTo('usuario');
    t.boolean('ativo').defaultTo(true);
    t.boolean('trocar_senha').defaultTo(false);
    t.timestamp('ultimo_acesso');
    t.timestamps(true, true);
  });

  await db.schema.createTableIfNotExists('produtos', t => {
    t.uuid('id').primary().defaultTo(db.raw('gen_random_uuid()'));
    t.uuid('arena_id').references('id').inTable('arenas').onDelete('CASCADE').notNullable();
    t.string('nome').notNullable();
    t.text('descricao');
    t.decimal('preco', 10, 2).notNullable();
    t.string('tipo').notNullable();
    t.boolean('visivel_marketplace').defaultTo(false);
    t.boolean('ativo').defaultTo(true);
    t.timestamps(true, true);
  });

  const { default: bcrypt } = await import('bcrypt');
  const existe = await db('usuarios').where({ role: 'super_admin' }).first();
  if (!existe) {
    const hash = await bcrypt.hash(process.env.ADMIN_SENHA || 'Admin@2026!', 10);
    await db('usuarios').insert({
      nome: 'Administrador',
      email: process.env.ADMIN_EMAIL || 'admin@picklemanager.com.br',
      senha_hash: hash,
      role: 'super_admin',
      arena_id: null,
    });
    console.log('Super admin criado!');
  }

  console.log('Migrations concluídas.');
  await db.destroy();
}

migrate().catch(err => { console.error(err); process.exit(1); });