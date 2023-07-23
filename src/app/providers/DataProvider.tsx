import React, { useContext } from "react";
import { AggregatedData, SumAggregatedData, useAggregatedData } from "@/shared";

interface DataContextValue {
  data: AggregatedData | null;
  sum: SumAggregatedData | null;
  loading: boolean;
}

const DataContext = React.createContext<DataContextValue>({
  data: null,
  sum: null,
  loading: true,
});

export function DataProvider({ children }: React.PropsWithChildren) {
  const { data, sum, loading } = useAggregatedData();
  return (
    <DataContext.Provider value={{ data, sum, loading }}>
      {children}
    </DataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useDataContext = () => useContext(DataContext);
