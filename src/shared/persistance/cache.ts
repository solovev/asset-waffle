import { Cipher } from "@/shared/crypto";

const SEPARATOR = "@";
const CACHE_VERSION = "1";

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

export async function writeCipherCache(
  cacheKey: Cache,
  cipherKey: CryptoKey,
  value: NonNullable<unknown>
) {
  const data = JSON.stringify(value);
  const cipher = new Cipher();
  const { encrypted, iv } = await cipher.encrypt(data, cipherKey);
  localStorage.setItem(cacheKey, encrypted + SEPARATOR + iv);
}

export async function readCipherCache<T = NonNullable<unknown>>(
  cacheKey: Cache,
  cipherKey: CryptoKey,
  defaultValue: T
): Promise<T> {
  const cache = getCache(cacheKey);
  if (!cache) {
    return defaultValue;
  }
  const [encrypted, iv] = cache.split(SEPARATOR);
  const cipher = new Cipher();
  const data = await cipher.decrypt(encrypted, cipherKey, iv);
  return JSON.parse(data) as T;
}

function getCache(key: Cache): string | null {
  return localStorage.getItem(key) || import.meta.env["VITE_" + key] || null;
}
