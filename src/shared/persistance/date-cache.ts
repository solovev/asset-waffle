import { clearCache, writeCache, readCache, Cache } from "./cache";

const DATE_SEPARATOR = "#DT_";
const MAX_CACHE_COUNT = 3;

export const writeCacheForToday: typeof writeCache = (
  key: Cache,
  value: NonNullable<unknown>,
  encode = false
) => {
  const now = new Date();
  const cache = readCacheForDate(key, now, null);
  if (cache) {
    return;
  }

  writeCache(getKey(key, now), value, encode);

  const oldCache = getCacheList(key).reverse().slice(MAX_CACHE_COUNT);
  for (const { date } of oldCache) {
    clearCache(getKey(key, date));
  }
};

export const readCacheForDate = <T = NonNullable<unknown>>(
  key: Cache,
  date: Date,
  defaultValue: T,
  decode = false
): T => {
  const value = readCache(getKey(key, date), defaultValue, decode);
  return value;
};

export function getRecentCache<T>(
  key: Cache
): { value: T; date: string } | null {
  const today = getStringDate();
  const cacheList = getCacheList<T>(key).reverse();

  for (const { value, date } of cacheList) {
    if (date !== today) {
      return { value, date };
    }
  }

  const todayCache = cacheList[0];
  if (todayCache) {
    const { value, date } = todayCache;
    return { value, date };
  }

  return null;
}

function getKey(key: Cache, date: Date | string): Cache {
  const stringData = typeof date === "string" ? date : getStringDate(date);
  return (key + DATE_SEPARATOR + stringData) as Cache;
}

function getStringDate(date?: Date): string {
  return (date ?? new Date()).toJSON().split("T")[0];
}

export function getCacheList<T = NonNullable<unknown>>(
  key: Cache
): { storageKey: string; date: string; value: T }[] {
  const result: { storageKey: string; date: string; value: T }[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const storageKey = localStorage.key(i)!;
    if (storageKey.indexOf(key + DATE_SEPARATOR) >= 0) {
      const [, date] = storageKey.split(DATE_SEPARATOR);
      const value = readCacheForDate<T>(key, new Date(date), {} as T);
      result.push({ storageKey, date, value });
    }
  }

  result.sort((a, b) => {
    return a.date.localeCompare(b.date);
  });

  return result;
}

export function clearDateCaches(key: Cache) {
  const list = getCacheList(key);
  for (const { date } of list) {
    clearCache(getKey(key, date));
  }
}
