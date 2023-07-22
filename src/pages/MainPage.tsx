// import { Multicall } from "@/shared/multicall";

export const MainPage = () => {
  return (
    <div className="flex justify-center items-center w-full h-full">
      {import.meta.env.VITE_POOLS}
    </div>
  );
};
