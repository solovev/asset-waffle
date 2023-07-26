import { useDataContext } from "@/app/providers";
import { SingleValueCard } from "@/entities";
import { SimpleGrid } from "@mantine/core";

export const TopTotal = () => {
  const { sum, data } = useDataContext();
  const { balance, balanceUSDT } = sum!;
  const { asset } = data!;
  const { price, symbol } = asset;
  return (
    <SimpleGrid cols={3} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
      <SingleValueCard title={`Total ${symbol}`} value={balance.toFixed(2)} />
      <SingleValueCard
        title="Total value (USDT)"
        value={balanceUSDT.toFixed(2)}
      />
      <SingleValueCard title={`${symbol} Price`} value={price.toFixed(4)} />
    </SimpleGrid>
  );
};
