import { useDataContext } from "@/app/providers";
import { LabeledValue, TabularWallets } from "@/entities";
import { SumAggregatedData } from "@/shared";
import { Card, Paper, Text, clsx, createStyles } from "@mantine/core";
import React from "react";

interface Props {
  wallets: string[];
}

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
  },
  pool: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
}));

export const PerWalletInfo: React.FC<Props> = ({ wallets }) => {
  const { classes } = useStyles();

  const { sum, data } = useDataContext();
  const { asset, pools } = data!;
  const { symbol } = asset;

  return (
    <Paper withBorder p="md" radius="md" className={classes.card}>
      <TabularWallets wallets={wallets} renderContent={renderContent} />
    </Paper>
  );

  function renderContent(wallet: string) {
    return (
      <TabContent>
        {wallet === "all" ? renderAll(sum!) : renderAll(data!.wallets[wallet])}
      </TabContent>
    );
  }

  function renderAll(sum: SumAggregatedData) {
    const { inWallets, inPools } = sum!;
    return (
      <>
        <div className="flex justify-evenly items-center flex-wrap">
          <LabeledValue
            label="On Wallet(s)"
            value={`$${inWallets.balanceUSDT.toFixed(2)}`}
            description={`${inWallets.balance.toFixed(2)} ${symbol}`}
            className="m-4"
          />
          <LabeledValue
            label="Total Earned"
            value={`$${inPools.reward.balanceUSDT.toFixed(2)}`}
            description={`${inPools.reward.balance.toFixed(2)} ${symbol}`}
            className="m-4"
          />
          <LabeledValue
            label="Total Staked"
            value={`$${inPools.staked.balanceUSDT.toFixed(2)}`}
            description={`${inPools.staked.balance.toFixed(2)} ${symbol}`}
            className="m-4"
          />
        </div>
        <div className="flex items-center flex-wrap">
          {Object.keys(pools).map((pool) => renderPoolCard(pool, sum))}
        </div>
      </>
    );
  }

  function renderPoolCard(poolAddress: string, sum: SumAggregatedData) {
    const { vesting } = pools[poolAddress];
    const balances = sum!.pools[poolAddress];
    return (
      <Card
        key={poolAddress}
        withBorder
        p="xl"
        radius="md"
        className={clsx(classes.pool, "mt-6 flex-shrink-0 flex-grow mx-2")}
      >
        <Text className="leading-4 text-lg mb-3">
          {getPoolName(vesting, symbol)}
        </Text>
        <div className="flex items-center justify-around flex-wrap">
          <LabeledValue
            label="Earned"
            value={`$${balances.reward.balanceUSDT.toFixed(2)}`}
            description={`${balances.reward.balance.toFixed(2)} ${symbol}`}
            className="m-4"
          />
          <LabeledValue
            label="Staked"
            value={`$${balances.staked.balanceUSDT.toFixed(2)}`}
            description={`${balances.staked.balance.toFixed(2)} ${symbol}`}
            className="m-4"
          />
        </div>
      </Card>
    );
  }
};

function TabContent({ children }: React.PropsWithChildren) {
  return <div className="p-3">{children}</div>;
}

function getPoolName(vesting: number, symbol: string) {
  let suffix = "?";
  if (vesting < 31) {
    suffix = "1 month";
  } else if (vesting < 100) {
    suffix = "3 months";
  } else if (vesting <= 365) {
    suffix = "1 year";
  }
  return `${symbol} Pool (${suffix})`;
}
