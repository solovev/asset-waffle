import { Cache, readEncryptedCache } from "@/shared";
import React, { useContext } from "react";
import { useAccessContext } from ".";

interface PoolsContextValue {
  pools: string[];
  loading: boolean;
}

const PoolsContext = React.createContext<PoolsContextValue>({
  pools: [],
  loading: true,
});

export function PoolsProvider({ children }: React.PropsWithChildren) {
  const [pools, setPools] = React.useState<string[]>([]);
  const [initialized, setInitialized] = React.useState(false);

  const { key, logout } = useAccessContext();

  React.useEffect(() => {
    if (initialized || !key) {
      return;
    }
    (async () => {
      try {
        const data = await readEncryptedCache<string[]>(Cache.POOLS, key, []);
        setPools(data);
        setInitialized(true);
      } catch (e) {
        console.warn(e);
        // Unable to decrypt cache -> move to login page.
        logout();
      }
    })();
  }, [initialized, key, logout]);

  return (
    <PoolsContext.Provider
      value={{ pools, loading: !initialized }}
    >
      {children}
    </PoolsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePoolsContext = () => useContext(PoolsContext);