import { AsyncLocalStorage } from 'async_hooks';
export const tenantStorage = new AsyncLocalStorage();
export function getArenaId() { var s = tenantStorage.getStore(); return s ? s.arenaId : null; }
export function getRole() { var s = tenantStorage.getStore(); return s ? s.role : null; }
export function isSuperAdmin() { var s = tenantStorage.getStore(); return s && s.role === 'super_admin'; }
