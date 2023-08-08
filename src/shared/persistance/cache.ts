const CACHE_VERSION = "2";

if (localStorage.getItem("CACHE_VERSION") !== CACHE_VERSION) {
  localStorage.clear();
  localStorage.setItem("CACHE_VERSION", CACHE_VERSION);
}

export enum Cache {
  ACCESS = "ACCESS",
  WALLETS = "WALLETS",
  POOLS = "POOLS",
  DATA = "DATA",
}

export function readCache<T = NonNullable<unknown>>(
  key: Cache,
  defaultValue: T,
  decode = true
): T {
  try {
    const cache = getCache(key);
    if (!cache) {
      return defaultValue;
    }
    return JSON.parse(decode ? atob(cache) : cache) as T;
  } catch (e) {
    console.warn(e);
    return defaultValue;
  }
}

export function writeCache(
  key: Cache,
  value: NonNullable<unknown>,
  encode = true
) {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, encode ? btoa(stringValue) : stringValue);
  } catch (e) {
    console.warn(e);
  }
}

export function clearCache(key: Cache) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn(e);
  }
}

function getCache(key: Cache): string | null {
  return localStorage.getItem(key) || null;
}
