import { Tile, Loading } from "@carbon/react";
import { Addresses, Pools } from "@/widgets";
import React from "react";
import { useWalletsContext } from "@/app/providers";

export const MainPage = () => {
  const { wallets, loading } = useWalletsContext();
  return (
    <div className="flex justify-center items-center w-full h-full">
      {loading && <Loading withOverlay={false} small />}
      {!loading && <PageContent wallets={wallets} />}
    </div>
  );
};

interface ContentProps {
  wallets: string[];
}

function PageContent({ wallets }: ContentProps) {
  const [selectedWallets, setSelectedWallets] =
    React.useState<string[]>(wallets);

  return (
    <Tile>
      <Addresses onChange={setSelectedWallets} wallets={wallets} />
      <Pools wallets={selectedWallets} />
    </Tile>
  );
}
