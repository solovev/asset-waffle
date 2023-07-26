import { LabeledValue, TabularWallets } from "@/entities";
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
  return (
    <Paper withBorder p="md" radius="md" className={classes.card}>
      <TabularWallets
        wallets={wallets}
        renderAll={renderAll}
        renderContent={(wallet) => <TabContent>{wallet}</TabContent>}
      />
    </Paper>
  );

  function renderAll() {
    return (
      <TabContent>
        <div className="flex justify-evenly items-center flex-wrap">
          <LabeledValue
            label="On Wallet(s)"
            value="$13123"
            description="123 ONI"
            className="m-4"
          />
          <LabeledValue
            label="Total Earned"
            value="$13123"
            description="123 ONI"
            className="m-4"
          />
          <LabeledValue
            label="Total Staked"
            value="$13123"
            description="123 ONI"
            className="m-4"
          />
        </div>
        <div className="flex items-center flex-wrap">
          {renderPoolCard("ONI Pool (1 month)")}
          {renderPoolCard("ONI Pool (3 months)")}
          {renderPoolCard("ONI Pool (1 year)")}
        </div>
      </TabContent>
    );
  }

  function renderPoolCard(title: string) {
    return (
      <Card
        withBorder
        p="xl"
        radius="md"
        className={clsx(classes.pool, "mt-6 flex-shrink-0 flex-grow mx-2")}
      >
        <Text className="leading-4 text-lg mb-3">{title}</Text>
        <div className="flex items-center justify-around flex-wrap">
          <LabeledValue
            label="Earned"
            value="$0"
            description="0 ONI"
            className="m-4"
          />
          <LabeledValue
            label="Staked"
            value="$0"
            description="0 ONI"
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
