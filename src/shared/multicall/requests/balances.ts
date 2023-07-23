import { MulticallRequest, MulticallResponse, makeMulticall } from "@/shared";
import { createPoolRequest } from "./wrappers";

export interface Balance {
  value: bigint;
  hasError: boolean;
}

interface Response {
  assets: { [pool: string]: string };
  balances: {
    [wallet: string]: {
      [pool: string]: { pendingReward: Balance; userInfo: Balance };
    };
  };
}

export async function getBalances(
  pools: string[],
  wallets: string[]
): Promise<Response> {
  const requests = createRequests(pools, wallets);
  const result = await makeMulticall(requests);

  const assetsResponses = result.slice(0, pools.length);
  const assets = mapAssets(assetsResponses);

  const balancesResponses = result.slice(assetsResponses.length);
  const balances = mapBalances(balancesResponses);

  return {
    assets,
    balances,
  };
}

function createRequests(
  pools: string[],
  wallets: string[]
): MulticallRequest[] {
  const requests: MulticallRequest[] = [];

  for (const pool of pools) {
    requests.push(createPoolRequest(pool, "stakedToken"));
  }

  for (const pool of pools) {
    for (const wallet of wallets) {
      requests.push(
        createPoolRequest(pool, "pendingReward", [wallet]),
        createPoolRequest(pool, "userInfo", [wallet])
      );
    }
  }
  return requests;
}

function mapAssets(responses: Awaited<ReturnType<typeof makeMulticall>>) {
  return responses.reduce((map, { request, response }) => {
    map[request.address] = response.data as string;
    return map;
  }, {} as Response["assets"]);
}

function mapBalances(
  responses: Awaited<ReturnType<typeof makeMulticall>>
): Response["balances"] {
  const wallets: Response["balances"] = {};

  for (const { request, response } of responses) {
    const wallet = request.args[0] as string;
    const pools = wallets[wallet] || (wallets[wallet] = {});
    const pool = request.address;
    const data = pools[pool] || (pools[pool] = getDefault());
    const key = request.functionName as "pendingReward" | "userInfo";
    data[key] = parseBalance(response);
  }

  return wallets;
}

export function parseBalance(response: MulticallResponse) {
  return {
    value: response.data as bigint,
    hasError: !response.success,
  };
}

function getDefault() {
  return {
    pendingReward: { value: 0n, hasError: false },
    userInfo: { value: 0n, hasError: false },
  };
}
