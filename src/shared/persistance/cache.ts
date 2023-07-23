import { Cipher } from "@/shared";

const SEPARATOR = "@";

export enum Cache {
  ACCESS = "ACCESS",
  WALLETS = "WALLETS",
  POOLS = "POOLS",
}

export function readCache<T = NonNullable<unknown>>(
  key: Cache,
  defaultValue: T
): T {
  try {
    const cache = getCache(key);
    if (!cache) {
      return defaultValue;
    }
    return JSON.parse(atob(cache)) as T;
  } catch (e) {
    console.warn(e);
    return defaultValue;
  }
}

export function writeCache(key: Cache, value: NonNullable<unknown>) {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, btoa(stringValue));
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

export async function writeEncryptedCache(
  cacheKey: Cache,
  cipherKey: CryptoKey,
  value: NonNullable<unknown>
) {
  const data = JSON.stringify(value);
  const cipher = new Cipher();
  const { encrypted, iv } = await cipher.encrypt(data, cipherKey);
  localStorage.setItem(cacheKey, encrypted + SEPARATOR + iv);
}

export async function readEncryptedCache<T = NonNullable<unknown>>(
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
