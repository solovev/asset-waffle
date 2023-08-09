import { MulticallRequest, MulticallResponse, makeMulticall } from "@/shared";
import { createPoolRequest } from "./wrappers";

export interface Balance {
  value: bigint;
  hasError: boolean;
}

interface BalanceResponse {
  pendingReward: Balance;
  balanceAmount: Balance;
  lastDepositedAt: number;
}

interface Response {
  assets: { [pool: string]: string };
  vesting: { [pool: string]: bigint };
  balances: {
    [wallet: string]: {
      [pool: string]: BalanceResponse;
    };
  };
}

export async function getBalances(
  pools: string[],
  wallets: string[]
): Promise<Response> {
  const requests = createRequests(pools, wallets);
  const result = await makeMulticall(requests);

  const assetsResponses = result.splice(0, pools.length);
  const assets = mapValue<string>(assetsResponses);

  const vestingResponses = result.splice(0, pools.length);
  const vesting = mapValue<bigint>(vestingResponses);

  const balances = mapBalances(result);

  return {
    assets,
    vesting,
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
    requests.push(createPoolRequest(pool, "vestingTime"));
  }

  for (const pool of pools) {
    for (const wallet of wallets) {
      requests.push(
        createPoolRequest(pool, "pendingReward", [wallet]),
        createPoolRequest(pool, "userInfo", [wallet], [0, 2])
      );
    }
  }
  return requests;
}

function mapValue<T>(responses: Awaited<ReturnType<typeof makeMulticall>>) {
  return responses.reduce((map, { request, response }) => {
    map[request.address] = response.data as T;
    return map;
  }, {} as Record<string, T>);
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

    switch (key) {
      case "pendingReward":
        data[key] = parseBalance(response);
        break;
      case "userInfo":
        parseUserInfo(data, response as MulticallResponse<bigint[]>);
        break;
      default:
        throw new Error(`Unknown key: "${key}"`);
    }
  }
  return wallets;
}

function parseUserInfo(
  balance: BalanceResponse,
  { data, success }: MulticallResponse<bigint[]>
) {
  balance["balanceAmount"] = parseBalance({ data: data[0], success });
  balance["lastDepositedAt"] = Number(data[1]);
}

export function parseBalance(response: MulticallResponse) {
  return {
    value: response.data as bigint,
    hasError: !response.success,
  };
}

function getDefault(): BalanceResponse {
  return {
    pendingReward: { value: 0n, hasError: false },
    balanceAmount: { value: 0n, hasError: false },
    lastDepositedAt: 0,
  };
}
