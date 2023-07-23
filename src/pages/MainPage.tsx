import { useStaticDataContext } from "@/app/providers";
import { Loader } from "@mantine/core";
import { useAggregatedData } from "@/shared";

export const MainPage = () => {
  const { loading: loadingStaticData } = useStaticDataContext();
  const { loading: loadingData, data } = useAggregatedData();
  const loading = loadingStaticData || loadingData;
  return (
    <div className="flex justify-center items-center w-full h-full">
      {loading ? <Loader /> : <>{JSON.stringify(data, null, 2)}</>}
    </div>
  );
};
