import { useDataContext } from "@/app/providers";
import { Loader } from "@mantine/core";

export const MainPage = () => {
  const { loading, data } = useDataContext();
  return (
    <div className="flex justify-center items-center w-full h-full">
      {loading ? <Loader /> : <>{JSON.stringify(data, null, 2)}</>}
    </div>
  );
};
