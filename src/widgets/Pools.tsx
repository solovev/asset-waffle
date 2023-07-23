import { usePoolsContext } from "@/app/providers";
import { useAggregatedData } from "@/shared";
import { ContainedList, ContainedListItem, InlineLoading } from "@carbon/react";
import React from "react";

interface Props {
  wallets: string[];
}

export const Pools: React.FC<Props> = React.memo(({ wallets }) => {
  const { pools } = usePoolsContext();
  const { data, sum, loading } = useAggregatedData(wallets);
  if (loading) {
    return <InlineLoading description="Loading data.." />;
  }

  console.log(data, sum);

  return <div>{pools.map(renderPool)}</div>;

  function renderPool(pool: string) {
    return <div key={pool}>{pool}</div>;
  }
});
