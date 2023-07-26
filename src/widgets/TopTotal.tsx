import { SingleValueCard } from "@/entities";
import { SimpleGrid } from "@mantine/core";

export const TopTotal = () => {
  return (
    <SimpleGrid cols={3} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
      <SingleValueCard title="Total ONI" value={1234567} />
      <SingleValueCard title="Total value (USDT)" value={1234567} />
      <SingleValueCard title="ONI Price" value={1234567} />
    </SimpleGrid>
  );
};
