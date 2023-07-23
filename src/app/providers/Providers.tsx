import { WalletsProvider, AccessProvider, PoolsProvider } from ".";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <AccessProvider>
      <WalletsProvider>
        <PoolsProvider>{children}</PoolsProvider>
      </WalletsProvider>
    </AccessProvider>
  );
}
