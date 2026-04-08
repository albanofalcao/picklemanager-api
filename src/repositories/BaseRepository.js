import { db } from '../db/connection.js';
import { getArenaId, isSuperAdmin } from '../middleware/tenantContext.js';

export class BaseRepository {
  constructor(tabela) { this.tabela = tabela; }
  _q() {
    var q = db(this.tabela);
    if (!isSuperAdmin() && getArenaId()) q.where(this.tabela + '.arena_id', getArenaId());
    return q;
  }
  findAll(f) { return this._q().where(f || {}); }
  findById(id) { return this._q().where({ id: id }).first(); }
  findOne(f) { return this._q().where(f).first(); }
  async create(d) {
    var p = isSuperAdmin() ? d : Object.assign({}, d, { arena_id: getArenaId() });
    var r = await db(this.tabela).insert(p).returning('*');
    return r[0];
  }
  async update(id, d) {
    var r = await this._q().where({ id: id }).update(d).returning('*');
    if (!r[0]) throw new Error('Nao encontrado');
    return r[0];
  }
  async delete(id) {
    var n = await this._q().where({ id: id }).delete();
    if (!n) throw new Error('Nao encontrado');
    return true;
  }
}
