import {
  useStaticDataContext,
} from "@/app/providers";
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

export function useAggregatedData(): Result {
  const { wallets, pools, loading: loadingStaticData } = useStaticDataContext();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<AggregatedData | null>(null);
  const [sum, setSum] = React.useState<SumAggregatedData | null>(null);

  React.useEffect(() => {
    (async () => {
      if (pools.length > 0 && wallets.length > 0) {
        setLoading(true);
        const data = await fetchAndAggregateData(pools, wallets);
        const sumData = sumAggregatedData(wallets, data);
        setSum(sumData);
        setData(data);
        setLoading(false);
      }
    })();
  }, [pools, wallets, setData, setLoading]);

  return {
    loading: loading || loadingStaticData,
    data,
    sum,
  };
}
