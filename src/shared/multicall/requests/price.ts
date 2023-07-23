import { MulticallRequest, convertToNumber, makeMulticall } from "@/shared";
import { createPancakeSwapRequest } from "./wrappers";

const BNB_ADDRESS = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const USDT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955";

export async function getPrice(
  decimals: bigint,
  asset: string
): Promise<number> {
  const requests: MulticallRequest[] = [
    createPancakeSwapRequest("getAmountsOut", [
      10n ** decimals,
      [asset, BNB_ADDRESS, USDT_ADDRESS],
    ]),
  ];
  const [{ response }] = await makeMulticall(requests);
  const { success, data } = response;
  const [, , usdtPrice] = Array.from(data as bigint[]);
  return success ? convertToNumber(decimals, usdtPrice) : 0;
}
