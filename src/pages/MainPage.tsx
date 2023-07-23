import { usePoolsContext, useWalletsContext } from "@/app/providers";
import { Loader } from "@mantine/core";
import { useAggregatedData } from "@/shared";

export const MainPage = () => {
  const { loading: loadingWallets } = useWalletsContext();
  const { loading: loadingPools } = usePoolsContext();
  const { loading: loadingData, data } = useAggregatedData();
  const loading = loadingWallets || loadingPools || loadingData;
  return (
    <div className="flex justify-center items-center w-full h-full">
      {loading ? <Loader /> : <>{JSON.stringify(data, null, 2)}</>}
    </div>
  );
};
