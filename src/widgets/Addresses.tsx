import { shrinkAddress } from "@/shared";
import { Add } from "@carbon/icons-react";
import { Select, SelectItem, Button } from "@carbon/react";
import React from "react";

interface Props {
  wallets: string[];
  onChange: (value: string[]) => void;
}

export const Addresses = ({ wallets, onChange }: Props) => {
  const handleChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      onChange(value === "all" ? wallets : [value]);
    },
    [wallets, onChange]
  );

  return (
    <div className="flex items-center justify-end">
      <div className="mr-3 text-zinc-400">Wallet(s)</div>
      <Select
        id="address-select"
        labelText=""
        size="sm"
        className="flex items-center mb-2 mr-3"
        onChange={handleChange}
      >
        <SelectItem value="all" text="All" />
        {wallets.map((address) => {
          return (
            <SelectItem
              key={address}
              value={address}
              text={shrinkAddress(address)}
            />
          );
        })}
      </Select>
      <Button
        renderIcon={Add}
        iconDescription="Icon Description"
        hasIconOnly
        kind="secondary"
        size="sm"
      />
    </div>
  );
};
