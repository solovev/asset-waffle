import { AccessProvider } from "./AccessProvider";

export function Providers({ children }: React.PropsWithChildren) {
    return <AccessProvider>{children}</AccessProvider>;
}
