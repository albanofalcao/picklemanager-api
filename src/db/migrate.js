import { db } from './connection.js';
import { up as up001 } from './migrations/001_create_groups.js';
import { up as up002 } from './migrations/002_create_arenas.js';
import { up as up003 } from './migrations/003_create_arena_responsaveis.js';
import { up as up004 } from './migrations/004_create_arena_quadras.js';

async function migrate() {
  console.log('Rodando migrations...');
  try {
    await up001(db);
    console.log('001 - grupos_economicos OK');
    await up002(db);
    console.log('002 - arenas OK');
    await up003(db);
    console.log('003 - arena_responsaveis OK');
    await up004(db);
    console.log('004 - arena_quadras OK');
    console.log('Migrations concluidas!');
  } catch (e) {
    console.error('Erro na migration:', e.message);
  } finally {
    await db.destroy();
  }
}

migrate();
