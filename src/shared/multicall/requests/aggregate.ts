import { getBalances } from "./balances";
import { getAssetData } from "./asset-data";
import { getPrice } from "./price";
import { convertToNumber } from "@/shared";

interface Balances {
  balance: number;
  balanceUSDT: number;
}

type PoolBalances = Record<
  string,
  {
    reward: Balances;
    staked: Balances;
  }
>;

interface WalletBalances extends Balances {
  pools: PoolBalances;
}

export interface AggregatedData {
  asset: { decimals: number; supply: number; symbol: string };
  balances: { [wallet: string]: WalletBalances };
  hasErrors: boolean;
}

export async function fetchAndAggregateData(
  pools: string[],
  wallets: string[]
): Promise<AggregatedData> {
  const { assets, balances: walletBalancesInPools } = await getBalances(
    pools,
    wallets
  );

  const listOfAssets = Array.from(new Set(Object.values(assets)));
  if (listOfAssets.length > 1) {
    throw new Error("Multiple assets are not supported");
  }

  const [asset] = listOfAssets;

  const { decimals, supply, symbol, walletBalances } = await getAssetData(
    asset,
    wallets
  );

  const price = await getPrice(decimals, asset);

  let hasErrors = price === 0;
  const balances: AggregatedData["balances"] = {};

  for (const wallet of wallets) {
    const walletBalance = walletBalances[wallet];
    hasErrors ||= walletBalance.hasError;

    const balance = (balances[wallet] = {
      balance: toNumber(walletBalance.value, decimals),
      balanceUSDT: toUSDT(walletBalance.value, decimals, price),
      pools: {} as PoolBalances,
    });

    for (const pool of pools) {
      const { pendingReward, userInfo } = walletBalancesInPools[wallet][pool];
      balance.pools[pool] = {
        reward: {
          balance: toNumber(pendingReward.value, decimals),
          balanceUSDT: toUSDT(pendingReward.value, decimals, price),
        },
        staked: {
          balance: toNumber(userInfo.value, decimals),
          balanceUSDT: toUSDT(userInfo.value, decimals, price),
        },
      };
      hasErrors ||= pendingReward.hasError || userInfo.hasError;
    }
  }
  return {
    asset: {
      decimals: Number(decimals),
      supply: convertToNumber(decimals, supply),
      symbol,
    },
    balances,
    hasErrors,
  };
}

export interface SumAggregatedData extends Balances {
  pools: PoolBalances;
}

export function sumAggregatedData(forWallets: string[], data: AggregatedData) {
  return forWallets.reduce(
    (sumAggregatedData, wallet) => {
      const { balance, balanceUSDT, pools } = data.balances[wallet];

      sumAggregatedData.balance += balance;
      sumAggregatedData.balanceUSDT += balanceUSDT;

      Object.keys(pools).forEach((pool) => {
        const { reward, staked } = pools[pool];

        if (!sumAggregatedData.pools[pool]) {
          sumAggregatedData.pools[pool] = {
            reward: {
              balance: 0,
              balanceUSDT: 0,
            },
            staked: {
              balance: 0,
              balanceUSDT: 0,
            },
          };
        }

        const sumPool = sumAggregatedData.pools[pool];
        sumPool.reward.balance += reward.balance;
        sumPool.reward.balanceUSDT += reward.balanceUSDT;
        sumPool.staked.balance += staked.balance;
        sumPool.staked.balanceUSDT += staked.balanceUSDT;
      });

      return sumAggregatedData;
    },
    {
      balance: 0,
      balanceUSDT: 0,
      pools: {},
    } as SumAggregatedData
  );
}

function toNumber(value: bigint, decimals: bigint): number {
  return convertToNumber(decimals, value);
}

function toUSDT(value: bigint, decimals: bigint, price: number): number {
  return convertToNumber(decimals, value) * price;
}
