import React, { useContext } from "react";
import {
  AggregatedData,
  Cache,
  SumAggregatedData,
  getDefaultAggregatedData,
  getDefaultSumAggregatedData,
  getRecentCache,
  useAggregatedData,
  writeCacheForToday,
} from "@/shared";
import get from "lodash.get";

interface DataContextValue {
  data: AggregatedData;
  sum: SumAggregatedData;
  cache: {
    date: string;
    value: Pick<DataContextValue, "data" | "sum">;
  } | null;
  getChange: (path: string) => number;
  loading: boolean;
}

type DataCache = NonNullable<DataContextValue["cache"]>["value"];

const DataContext = React.createContext<DataContextValue>({
  data: getDefaultAggregatedData(),
  sum: getDefaultSumAggregatedData(),
  cache: null,
  loading: true,
  getChange: () => 0,
});

const cache = getRecentCache<DataCache>(Cache.DATA);

export function DataProvider({ children }: React.PropsWithChildren) {
  const { data, sum, loading } = useAggregatedData();

  React.useEffect(() => {
    if (data && sum) {
      writeCacheForToday(Cache.DATA, { data, sum } as DataCache);
    }
  }, [data, sum]);

  const contextValue = {
    data: data ?? getDefaultAggregatedData(),
    sum: sum ?? getDefaultSumAggregatedData(),
    loading,
    cache,
  };

  const getChange = (path: string): number => {
    const cacheValue = get(cache, "value." + path, 0);
    const value = get(contextValue, path, 0);
    if (cacheValue === 0) {
      return 0;
    }
    const change = value - cacheValue;
    return (change / cacheValue) * 100;
  };

  return (
    <DataContext.Provider value={{ ...contextValue, getChange }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => useContext(DataContext);
