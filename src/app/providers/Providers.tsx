import { MantineProvider } from "@mantine/core";
import { WalletsProvider, AccessProvider, PoolsProvider } from ".";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <AccessProvider>
        <WalletsProvider>
          <PoolsProvider>{children}</PoolsProvider>
        </WalletsProvider>
      </AccessProvider>
    </MantineProvider>
  );
}
