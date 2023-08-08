import { MantineProvider } from "@mantine/core";
import { StaticDataProvider, DataProvider } from ".";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <StaticDataProvider>
        <DataProvider>{children}</DataProvider>
      </StaticDataProvider>
    </MantineProvider>
  );
}
