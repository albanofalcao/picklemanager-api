export async function up(db) {
  await db.schema.createTable('arena_quadras', (t) => {
    t.increments('id').primary();
    t.integer('arena_id').notNullable().references('id').inTable('arenas').onDelete('CASCADE');
    t.string('nome').notNullable();
    t.decimal('comprimento_m');
    t.decimal('largura_m');
    t.enu('cobertura', ['coberta', 'descoberta', 'mista']);
    t.enu('tipo_piso', ['cimento', 'sintetico', 'madeira', 'outro']);
    t.enu('status', ['ativa', 'inativa', 'manutencao']).defaultTo('ativa');
    t.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('arena_quadras');
}
