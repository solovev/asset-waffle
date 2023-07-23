import { Cache, readEncryptedCache, writeEncryptedCache } from "@/shared";
import React, { useContext } from "react";
import { useAccessContext } from ".";

interface WalletsContextValue {
  wallets: string[];
  loading: boolean;
  addWallet: (wallet: string) => void;
  removeWallet: (wallet: string) => void;
}

const WalletsContext = React.createContext<WalletsContextValue>({
  wallets: [],
  loading: true,
  addWallet: () => {},
  removeWallet: () => {},
});

export function WalletsProvider({ children }: React.PropsWithChildren) {
  const [wallets, setWallets] = React.useState<string[]>([]);
  const [initialized, setInitialized] = React.useState(false);

  const { key, logout } = useAccessContext();

  React.useEffect(() => {
    if (initialized || !key) {
      return;
    }
    (async () => {
      try {
        const data = await readEncryptedCache<string[]>(Cache.WALLETS, key, []);
        setWallets(data);
        setInitialized(true);
      } catch (e) {
        console.warn(e);
        // Unable to decrypt cache -> move to login page.
        logout();
      }
    })();
  }, [initialized, key, logout]);

  const setAndCacheWallets = React.useCallback(
    (newWallets: string[]) => {
      setWallets(newWallets);
      writeEncryptedCache(Cache.WALLETS, key!, newWallets);
    },
    [key]
  );

  const addWallet = React.useCallback(
    (wallet: string) => {
      const walletIndex = wallets.indexOf(wallet);
      if (walletIndex < 0) {
        const newWallets = [...wallets, wallet];
        setAndCacheWallets(newWallets);
      }
    },
    [wallets, setAndCacheWallets]
  );

  const removeWallet = React.useCallback(
    (wallet: string) => {
      const newWallets = wallets.filter((w) => w === wallet);
      if (wallets.length !== newWallets.length) {
        setAndCacheWallets(newWallets);
      }
    },
    [wallets, setAndCacheWallets]
  );

  return (
    <WalletsContext.Provider
      value={{ wallets, addWallet, removeWallet, loading: !initialized }}
    >
      {children}
    </WalletsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useWalletsContext = () => useContext(WalletsContext);