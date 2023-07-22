export enum Cache {
  ACCESS = "ACCESS",
}

export function readCache<T = NonNullable<unknown>>(key: Cache, defaultValue: T): T {
  try {
    const cache = localStorage.getItem(key);
    if (!cache) {
      return defaultValue;
    }
    return JSON.parse(cache) as T;
  } catch (e) {
    console.warn(e);
    return defaultValue;
  }
}

export function writeCache(key: Cache, value: NonNullable<unknown>) {
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (e) {
    console.warn(e);
  }
}
