import { MantineProvider } from "@mantine/core";
import { StaticDataProvider, AccessProvider } from ".";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{ colorScheme: "dark" }}
    >
      <AccessProvider>
        <StaticDataProvider>{children}</StaticDataProvider>
      </AccessProvider>
    </MantineProvider>
  );
}
