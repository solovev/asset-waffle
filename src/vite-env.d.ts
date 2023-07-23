/// <reference types="vite/client" />

import React from "react";

export * from "@carbon/react";

declare module "@carbon/react" {
  declare const InlineLoading: React.ForwardRefExoticComponent<
    { description: string } & React.RefAttributes<unknown>
  >;

  declare const Loading: React.ForwardRefExoticComponent<
    {
      withOverlay: boolean;
      small: boolean;
    } & React.RefAttributes<unknown>
  >;

  declare const Select: React.ForwardRefExoticComponent<
    {
      labelText: string;
      size: string;
      className: string;
      id: string;
      children: React.ReactNode;
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    } & React.RefAttributes<unknown>
  >;

  declare const SelectItem: React.ForwardRefExoticComponent<
    {
      value: string;
      text: string;
    } & React.RefAttributes<unknown>
  >;

  declare const ContainedList: React.ForwardRefExoticComponent<
    {
      kind: string;
      label: string;
      children: React.ReactNode;
    } & React.RefAttributes<unknown>
  >;

  declare const ContainedListItem: React.ForwardRefExoticComponent<
    {
      children: React.ReactNode;
    } & React.RefAttributes<unknown>
  >;
}
