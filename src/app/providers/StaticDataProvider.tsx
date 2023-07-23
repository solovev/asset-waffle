import { Cache, readCipherCache } from "@/shared";
import React, { useContext } from "react";
import { useAccessContext } from ".";

interface StaticDataContextValue {
  pools: string[];
  wallets: string[];
  loading: boolean;
}

const StaticDataContext = React.createContext<StaticDataContextValue>({
  pools: [],
  wallets: [],
  loading: true,
});

export function StaticDataProvider({ children }: React.PropsWithChildren) {
  const [pools, setPools] = React.useState<string[]>([]);
  const [wallets, setWallets] = React.useState<string[]>([]);

  const [initialized, setInitialized] = React.useState(false);

  const { key, logout } = useAccessContext();

  React.useEffect(() => {
    (async () => {
      if (!key) {
        return;
      }

      try {
        const pools = await readCipherCache<string[]>(Cache.POOLS, key, []);
        const wallets = await readCipherCache<string[]>(Cache.WALLETS, key, []);

        setPools(pools);
        setWallets(wallets);
        setInitialized(true);
      } catch (e) {
        console.warn(e);
        // Unable to decrypt cache -> move to login page.
        logout();
      }
    })();
  }, [initialized, key, logout]);

  return (
    <StaticDataContext.Provider
      value={{ pools, wallets, loading: !initialized }}
    >
      {children}
    </StaticDataContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStaticDataContext = () => useContext(StaticDataContext);
