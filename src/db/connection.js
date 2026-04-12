import knex from 'knex';
import pg from 'pg';

pg.defaults.ssl = { rejectUnauthorized: false };

export const db = knex({
  client: 'pg',
  connection: process.env.DATABASE_URL,
});
