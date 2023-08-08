import { Wallet } from "@/app/providers";
import { shrinkAddress } from "@/shared";
import { AddWalletModal } from "@/widgets/AddWalletModal";
import { DeleteWalletModal } from "@/widgets/DeleteWalletModal";
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
  wallets: Wallet[];
  renderContent: (wallet: "all" | string) => React.ReactNode;
}

const icons = [
  IconNumber0,
  IconNumber1,
  IconNumber2,
  IconNumber3,
  IconNumber4,
  IconNumber5,
];

const DEFAULT = "all";

export const TabularWallets: React.FC<Props> = ({ wallets, renderContent }) => {
  const [currentTab, setCurrentTab] = React.useState<string | null>(DEFAULT);
  return (
    <Tabs defaultValue={DEFAULT} onTabChange={setCurrentTab}>
      <div className="flex items-center">
        <Tabs.List className="flex-1">
          <Tabs.Tab value={DEFAULT}>All</Tabs.Tab>
          {wallets.map(renderTab)}
        </Tabs.List>
        <div className="ml-4 flex items-center flex-wrap flex-shrink">
          {currentTab && currentTab !== DEFAULT && (
            <DeleteWalletModal
              currentTab={currentTab}
              className="flex-shrink-0"
            />
          )}
          <AddWalletModal
            openByDefault={wallets.length === 0}
            className="flex-shrink-0"
          />
        </div>
      </div>

      <Tabs.Panel value={DEFAULT} pt="xs">
        {renderContent(DEFAULT)}
      </Tabs.Panel>

      {wallets.map((wallet) => {
        const { address } = wallet;
        return (
          <Tabs.Panel key={address} value={address} pt="xs">
            {renderContent(address)}
          </Tabs.Panel>
        );
      })}
    </Tabs>
  );

  function renderTab({ address, label }: Wallet, index: number) {
    const Icon = icons[index];
    return (
      <Tabs.Tab
        key={address}
        value={address}
        icon={<Icon size="0.8rem" color="gray" />}
      >
        {label || shrinkAddress(address)}
      </Tabs.Tab>
    );
  }
};
