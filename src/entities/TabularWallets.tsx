import { shrinkAddress } from "@/shared";
import { Tabs } from "@mantine/core";
import {
  IconNumber0,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber5,
} from "@tabler/icons-react";
import React from "react";

interface Props {
  wallets: string[];
  renderAll: () => React.ReactNode;
  renderContent: (wallet: string) => React.ReactNode;
}

const icons = [
  IconNumber0,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber5,
];

export const TabularWallets: React.FC<Props> = ({
  wallets,
  renderAll,
  renderContent,
}) => {
  return (
    <Tabs defaultValue="all">
      <Tabs.List>
        <Tabs.Tab value="all">All</Tabs.Tab>
        {wallets.map(renderTab)}
      </Tabs.List>

      <Tabs.Panel value="all" pt="xs">
        {renderAll()}
      </Tabs.Panel>

      {wallets.map((wallet) => {
        return (
          <Tabs.Panel key={wallet} value={wallet} pt="xs">
            {renderContent(wallet)}
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );

  function renderTab(wallet: string, index: number) {
    const Icon = icons[index];
    return (
      <Tabs.Tab
        key={wallet}
        value={wallet}
        icon={<Icon size="0.8rem" color="gray" />}
      >
        {shrinkAddress(wallet)}
      </Tabs.Tab>
    );
  }
};
