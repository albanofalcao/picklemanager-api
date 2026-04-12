import knex from 'knex';

export const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const dbAdmin = knex({
  client: 'pg',
  connection: process.env.DATABASE_ADMIN_URL,
  ssl: { rejectUnauthorized: false }
});
