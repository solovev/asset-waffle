import { readCache, Cache } from "@/shared";
import React from "react";

interface AccessContextValue {
  passcode: string;
  setPasscode: (value: string) => void;
}

const AccessContext = React.createContext<AccessContextValue>(
  readCache(Cache.ACCESS, {
    passcode: "",
    setPasscode: () => {},
  })
);

export function AccessProvider({ children }: React.PropsWithChildren) {
  const [passcode, setPasscode] = React.useState("");

  return (
    <AccessContext.Provider value={{ passcode, setPasscode }}>
      {children}
    </AccessContext.Provider>
  );
}
