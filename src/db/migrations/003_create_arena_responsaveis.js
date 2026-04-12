export async function up(db) {
  await db.schema.createTable('arena_responsaveis', (t) => {
    t.increments('id').primary();
    t.integer('arena_id').notNullable().references('id').inTable('arenas').onDelete('CASCADE');
    t.string('nome').notNullable();
    t.string('telefone');
    t.string('email');
    t.string('cargo');
    t.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('arena_responsaveis');
}
