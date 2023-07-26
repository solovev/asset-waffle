import { useDataContext, useStaticDataContext } from "@/app/providers";
import { PerWalletInfo, TopTotal } from "@/widgets";
import { Loader, Space } from "@mantine/core";

export const MainPage = () => {
  const { loading } = useDataContext();
  return loading ? <Loading /> : <Content />;
};

function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <Loader />
    </div>
  );
}

function Content() {
  const { wallets } = useStaticDataContext();
  return (
    <div className="max-w-5xl m-auto p-6 md:pt-32">
      <TopTotal />
      <Space h="md" />
      <PerWalletInfo wallets={wallets} />
    </div>
  );
}
