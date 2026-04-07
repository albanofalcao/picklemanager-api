import { db } from '../db/connection.js';
import { getArenaId, isSuperAdmin } from '../middleware/tenantContext.js';

export class BaseRepository {
  constructor(tabela) { this.tabela = tabela; }
  _q() {
    const q = db(this.tabela);
    if (!isSuperAdmin() && getArenaId()) q.where(`${this.tabela}.arena_id`, getArenaId());
    return q;
  }
  findAll(f = {})  { return this._q().where(f); }
  findById(id)     { return this._q().where({ id }).first(); }
  findOne(f)       { return this._q().where(f).first(); }
  async create(d)  {
    const p = isSuperAdmin() ? d : { ...d, arena_id: getArenaId() };
    const [r] = await db(this.tabela).insert(p).returning('*');
    return r;
  }
  async update(id, d) {
    const [r] = await this._q().where({ id }).update(d).returning('*');
    if (!r) throw new Error('Não encontrado');
    return r;
  }
  async delete(id) {
    const n = await this._q().where({ id }).delete();
    if (!n) throw new Error('Não encontrado');
    return true;
  }
}