export async function up(db) {
  await db.schema.createTable('grupos_economicos', (t) => {
    t.increments('id').primary();
    t.string('nome').notNullable();
    t.string('cnpj');
    t.string('responsavel');
    t.string('telefone');
    t.string('email');
    t.text('observacoes');
    t.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('grupos_economicos');
}
