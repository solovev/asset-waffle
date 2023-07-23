import { Balance, MulticallRequest, makeMulticall, parseBalance } from "@/shared";
import { createERC20Request } from "./wrappers";

export async function getAssetData(asset: string, wallets: string[]) {
  const requests = createRequests(asset, wallets);
  const [decimals, ...restResponses] = await makeMulticall(requests);

  const balancesResponses = restResponses.slice(0, wallets.length);
  const walletBalances = getBalances(balancesResponses);

  return {
    decimals: getDecimals(decimals),
    walletBalances,
  };
}

function createRequests(asset: string, wallets: string[]): MulticallRequest[] {
  const requests: MulticallRequest[] = [createERC20Request(asset, "decimals")];
  for (const wallet of wallets) {
    requests.push(createERC20Request(asset, "balanceOf", [wallet]));
  }
  return requests;
}

function getDecimals({
  response,
}: Awaited<ReturnType<typeof makeMulticall>>[0]) {
  const { data, success } = response;
  if (!success) {
    throw new Error("Can't get decimals");
  }
  return data as bigint;
}

function getBalances(responses: Awaited<ReturnType<typeof makeMulticall>>) {
  const balances: Record<string, Balance> = {};

  for (const { request, response } of responses) {
    balances[request.args[0] as string] = parseBalance(response);
  }

  return balances;
}
