import { Cache, clearDateCaches, readCache, writeCache } from "@/shared";
import React, { useContext } from "react";

export interface Wallet {
  address: string;
  label: string;
}

interface StaticDataContextValue {
  pools: string[];
  wallets: Wallet[];
  setPools: (pools: string[]) => void;
  setWallets: (wallets: Wallet[]) => void;
}

const StaticDataContext = React.createContext<StaticDataContextValue>({
  pools: [],
  wallets: [],
  setPools: () => {},
  setWallets: () => {},
});

export function StaticDataProvider({ children }: React.PropsWithChildren) {
  const [pools, setPools] = React.useState<string[]>(
    readCache<string[]>(Cache.POOLS, import.meta.env.VITE_POOLS.split(','))
  );
  const [wallets, setWalletsInternal] = React.useState<Wallet[]>(
    readCache<Wallet[]>(Cache.WALLETS, [])
  );

  const setWallets = React.useCallback((wallets: Wallet[]) => {
    clearDateCaches(Cache.DATA);
    writeCache(Cache.WALLETS, wallets);
    setWalletsInternal(wallets);
  }, []);

  return (
    <StaticDataContext.Provider
      value={{ pools, wallets, setPools, setWallets }}
    >
      {children}
    </StaticDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStaticDataContext = () => useContext(StaticDataContext);
