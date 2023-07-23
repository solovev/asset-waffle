/// <reference types="vite/client" />

export * from "@carbon/react";

declare module "@carbon/react" {
  declare const InlineLoading: React.ForwardRefExoticComponent<
    { description: string } & React.RefAttributes<unknown>
  >;

  declare const Loading: React.ForwardRefExoticComponent<
    NonNullable<unknown> & React.RefAttributes<unknown>
  >;
}
