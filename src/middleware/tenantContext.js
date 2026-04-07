import { AsyncLocalStorage } from 'async_hooks';
export const tenantStorage = new AsyncLocalStorage();
export const getArenaId   = () => tenantStorage.getStore()?.arenaId ?? null;
export const getRole      = () => tenantStorage.getStore()?.role ?? null;
export const isSuperAdmin = () => tenantStorage.getStore()?.role === 'super_admin';