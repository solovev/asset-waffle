import { readCache, Cache, Cipher, waitFor, writeCache } from "@/shared";
import React, { useContext } from "react";

const cachedPassword = readCache(Cache.ACCESS, "");

interface AccessContextValue {
  password: string;
  loading: boolean;
  hasAccess: boolean;
  key: CryptoKey | null;
  error: string | null;
  attempt: number;
  submitPassword: (value: string) => void;
}

const AccessContext = React.createContext<AccessContextValue>({
  password: cachedPassword,
  loading: !!cachedPassword,
  hasAccess: false,
  key: null,
  error: null,
  attempt: 0,
  submitPassword: () => {},
});

export function AccessProvider({ children }: React.PropsWithChildren) {
  const [password, submitPassword] = React.useState(cachedPassword);
  const [loading, setLoading] = React.useState(!!cachedPassword);
  const [key, setKey] = React.useState<CryptoKey | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [attempt, setAttempt] = React.useState<number>(0);

  React.useEffect(() => {
    if (!password) {
      return;
    }

    const tryPassword = async (password: string) => {
      const cipher = new Cipher();

      setLoading(true);
      setError(null);

      const multiplier = Math.max(Math.min(attempt, 3), 1);
      await waitFor(500 * multiplier);

      try {
        const key = await cipher.unwrapKey(
          import.meta.env.VITE_CIPHER_KEY,
          password
        );
        setKey(key);

        writeCache(Cache.ACCESS, password);
      } catch (e) {
        console.warn(e);
        setError("Wrong password");
        setAttempt(attempt + 1);
        submitPassword("");
      }
      setLoading(false);
    };

    tryPassword(password);
  }, [password, attempt]);

  return (
    <AccessContext.Provider
      value={{
        password,
        attempt,
        hasAccess: !!key,
        loading,
        key,
        error,
        submitPassword,
      }}
    >
      {children}
    </AccessContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAccessContext = () => useContext(AccessContext);
