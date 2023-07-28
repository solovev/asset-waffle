import { useDataContext } from "@/app/providers";
import { SingleValueCard } from "@/entities";
import { SimpleGrid } from "@mantine/core";

export const TopTotal = () => {
  const context = useDataContext();

  const { sum, data, getChange, cache } = context;
  const { balance, balanceUSDT } = sum!;
  const { asset } = data!;
  const { price, symbol } = asset;

  return (
    <SimpleGrid cols={3} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
      <SingleValueCard
        title={`Total ${symbol}`}
        value={balance.toFixed(2)}
        diff={getChange("sum.balance")}
        cacheDate={cache?.date}
      />
      <SingleValueCard
        title="Total value (USDT)"
        value={balanceUSDT.toFixed(2)}
        diff={getChange("sum.balanceUSDT")}
        cacheDate={cache?.date}
      />
      <SingleValueCard
        title={`${symbol} Price`}
        value={price.toFixed(4)}
        diff={getChange("data.asset.price")}
        cacheDate={cache?.date}
      />
    </SimpleGrid>
  );
};
