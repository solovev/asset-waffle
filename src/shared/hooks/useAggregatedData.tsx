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
  const { wallets, pools } = useStaticDataContext();
  const [loading, setLoading] = React.useState(wallets.length > 0);
  const [data, setData] = React.useState<AggregatedData | null>(null);
  const [sum, setSum] = React.useState<SumAggregatedData | null>(null);

  React.useEffect(() => {
    (async () => {
      if (pools.length > 0 && wallets.length > 0) {
        const addresses = wallets.map((wallet) => wallet.address);
        setLoading(true);
        const data = await fetchAndAggregateData(pools, addresses);
        const sumData = sumAggregatedData(addresses, data);
        setSum(sumData);
        setData(data);
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify([pools, wallets])]);

  return {
    loading,
    data,
    sum,
  };
}
