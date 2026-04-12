export async function up(db) {
  await db.schema.createTable('arenas', (t) => {
    t.increments('id').primary();
    t.integer('grupo_economico_id').references('id').inTable('grupos_economicos').onDelete('SET NULL');
    t.string('nome').notNullable();
    t.string('endereco');
    t.string('bairro');
    t.string('cidade');
    t.string('cep');
    t.decimal('area_total_m2');
    t.enu('status', ['ativa', 'inativa', 'suspensa']).defaultTo('ativa');
    t.enu('plano', ['basico', 'pro', 'premium']).notNullable();
    t.string('subdominio').unique();
    t.date('data_contrato');
    t.date('vigencia_contrato');
    t.string('canal_aquisicao');
    t.date('data_onboarding');
    t.text('observacoes_internas');
    t.boolean('cobranca_pelo_grupo').defaultTo(false);
    t.timestamps(true, true);
  });
}

export async function down(db) {
  await db.schema.dropTableIfExists('arenas');
}
