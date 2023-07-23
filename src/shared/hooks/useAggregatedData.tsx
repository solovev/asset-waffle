import { usePoolsContext, useWalletsContext } from "@/app/providers";
import {
  AggregatedData,
  SumAggregatedData,
  fetchAndAggregateData,
  sumAggregatedData,
} from "@/shared";
import React from "react";

interface Result {
  data: AggregatedData | null;
  sum: SumAggregatedData | null;
  loading: boolean;
}

export function useAggregatedData(forWallets: string[]): Result {
  const { wallets, loading: loadingWallets } = useWalletsContext();
  const { pools, loading: loadingPools } = usePoolsContext();

  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<AggregatedData | null>(null);
  const [sum, setSum] = React.useState<SumAggregatedData | null>(null);

  React.useEffect(() => {
    (async () => {
      if (pools.length > 0 && wallets.length > 0) {
        setLoading(true);
        const data = await fetchAndAggregateData(pools, wallets);
        const sumData = sumAggregatedData(forWallets, data);
        setSum(sumData);
        setData(data);
        setLoading(false);
      }
    })();
  }, [forWallets, pools, wallets, setData, setLoading]);

  return {
    loading: loading || loadingWallets || loadingPools,
    data,
    sum,
  };
}

