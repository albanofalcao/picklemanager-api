export async function up(db) {
  await db.raw('ALTER TABLE grupos_economicos DISABLE ROW LEVEL SECURITY');
  await db.raw('ALTER TABLE arenas DISABLE ROW LEVEL SECURITY');
  await db.raw('ALTER TABLE arena_responsaveis DISABLE ROW LEVEL SECURITY');
  await db.raw('ALTER TABLE arena_quadras DISABLE ROW LEVEL SECURITY');
}

export async function down(db) {}
