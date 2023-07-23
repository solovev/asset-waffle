import { MantineProvider } from "@mantine/core";
import { StaticDataProvider, AccessProvider, DataProvider } from ".";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <AccessProvider>
        <StaticDataProvider>
          <DataProvider>{children}</DataProvider>
        </StaticDataProvider>
      </AccessProvider>
    </MantineProvider>
  );
}
