import { Cache, getCacheList, getRecentCache, writeCacheForToday } from ".";

describe("writeCacheForDate", () => {
  beforeAll(() => {
    jest.useFakeTimers();

    localStorage.removeItem("CACHE_VERSION");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("Should write cache and corresponding date", () => {
    const date = "2021-02-18";
    jest.setSystemTime(new Date(date));

    writeCacheForToday(Cache.DATA, "[1]");

    expect(localStorage.key(0)).toBe(Cache.DATA + "#DT_" + date);
    expect(localStorage.getItem(Cache.DATA + "#DT_" + date)).toBe('"[1]"');
  });

  it("Should not write cache if date is the same", () => {
    const date = "2021-02-18";
    jest.setSystemTime(new Date(date));

    writeCacheForToday(Cache.DATA, "[1]");
    writeCacheForToday(Cache.DATA, "[2]");
    writeCacheForToday(Cache.DATA, "[3]");

    expect(localStorage.keys.length).toBe(1);
    expect(localStorage.key(0)).toBe(Cache.DATA + "#DT_" + date);
    expect(localStorage.getItem(Cache.DATA + "#DT_" + date)).toBe('"[1]"');
  });

  it("Should add new cache if date changed", () => {
    let date = "2021-02-18";
    jest.setSystemTime(new Date(date));

    writeCacheForToday(Cache.DATA, "[1]");
    writeCacheForToday(Cache.DATA, "[2]");

    date = "2023-07-27";
    jest.setSystemTime(new Date(date));

    writeCacheForToday(Cache.DATA, "[3]");

    expect(localStorage.keys.length).toBe(2);

    expect(localStorage.key(0)).toBe(Cache.DATA + "#DT_2021-02-18");
    expect(localStorage.key(1)).toBe(Cache.DATA + "#DT_2023-07-27");

    expect(localStorage.getItem(localStorage.key(0)!)).toBe('"[1]"');
    expect(localStorage.getItem(localStorage.key(1)!)).toBe('"[3]"');
  });

  it("Should return sorted list", () => {
    let date = "2024-02-18";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[1]");

    date = "2021-07-27";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[2]");

    date = "2023-07-28";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[3]");

    const list = getCacheList(Cache.DATA).map((cache) => cache.date);
    expect(list).toEqual(["2021-07-27", "2023-07-28", "2024-02-18"]);
  });

  it("Should first recent cache (not today)", () => {
    let date = "2024-02-18";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[1]");

    date = "2021-07-27";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[2]");

    date = "2023-07-28";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[3]");

    date = "2024-02-18";
    jest.setSystemTime(new Date(date));
    const cache = getRecentCache<string>(Cache.DATA);
    expect(cache?.value).toEqual("[3]");
  });

  it("Should today recent cache (if there is nothing else)", () => {
    const date = "2024-02-18";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[1]");
    const cache = getRecentCache<string>(Cache.DATA);
    expect(cache?.value).toEqual("[1]");
  });

  it("Should remove old cache if count of caches > 3", () => {
    let date = "2021-02-18";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[1]");

    date = "2023-07-27";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[2]");

    date = "2023-07-28";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[3]");

    expect(localStorage.keys.length).toBe(3);

    expect(localStorage.key(0)).toBe(Cache.DATA + "#DT_2021-02-18");
    expect(localStorage.key(1)).toBe(Cache.DATA + "#DT_2023-07-27");
    expect(localStorage.key(2)).toBe(Cache.DATA + "#DT_2023-07-28");

    date = "2023-07-29";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[4]");

    date = "2023-07-30";
    jest.setSystemTime(new Date(date));
    writeCacheForToday(Cache.DATA, "[5]");

    expect(localStorage.keys.length).toBe(3);
    const list = getCacheList(Cache.DATA).map((cache) => cache.date);
    expect(list).toEqual(["2023-07-28", "2023-07-29", "2023-07-30"]);
  });
});
