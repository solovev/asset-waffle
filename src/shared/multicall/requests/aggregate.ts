import { getBalances } from "./balances";
import { getAssetData } from "./asset-data";
import { getPrice } from "./price";
import { convertToNumber } from "@/shared";

interface Balances {
  balance: number;
  balanceUSDT: number;
}

interface PoolBalance {
  reward: Balances;
  staked: Balances;
}

interface WalletBalances extends Balances {
  pools: Record<string, PoolBalance>;
}

export interface AggregatedData {
  pools: { [pool: string]: { vesting: number } };
  asset: { decimals: number; supply: number; symbol: string; price: number };
  balances: { [wallet: string]: WalletBalances };
  hasErrors: boolean;
}

export async function fetchAndAggregateData(
  pools: string[],
  wallets: string[]
): Promise<AggregatedData> {
  const {
    assets,
    vesting,
    balances: walletBalancesInPools,
  } = await getBalances(pools, wallets);

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
      pools: {} as Record<string, PoolBalance>,
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
      price,
    },
    pools: mapPools(vesting),
    balances,
    hasErrors,
  };
}

function mapPools(vesting: Record<string, bigint>): AggregatedData["pools"] {
  return Object.keys(vesting).reduce((map, pool) => {
    map[pool] = { vesting: Number(vesting[pool]) / 60 / 60 / 24 };
    return map;
  }, {} as AggregatedData["pools"]);
}

export interface SumAggregatedData extends Balances {
  walletBalances: Balances;
  inPools: PoolBalance;
  pools: Record<string, PoolBalance>;
}

export function sumAggregatedData(forWallets: string[], data: AggregatedData) {
  return forWallets.reduce(
    (sumAggregatedData, wallet) => {
      const { balance, balanceUSDT, pools } = data.balances[wallet];

      sumAggregatedData.walletBalances.balance += balance;
      sumAggregatedData.walletBalances.balanceUSDT += balanceUSDT;

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

        sumAggregatedData.inPools.reward.balance += reward.balance;
        sumAggregatedData.inPools.reward.balanceUSDT += reward.balanceUSDT;
        sumAggregatedData.inPools.staked.balance += staked.balance;
        sumAggregatedData.inPools.staked.balanceUSDT += staked.balanceUSDT;

        sumAggregatedData.balance += reward.balance + staked.balance;
        sumAggregatedData.balanceUSDT +=
          reward.balanceUSDT + staked.balanceUSDT;
      });

      return sumAggregatedData;
    },
    {
      balance: 0,
      balanceUSDT: 0,
      pools: {},
      walletBalances: {
        balance: 0,
        balanceUSDT: 0,
      },
      inPools: {
        reward: {
          balance: 0,
          balanceUSDT: 0,
        },
        staked: { balance: 0, balanceUSDT: 0 },
      },
    } as SumAggregatedData
  );
}

function toNumber(value: bigint, decimals: bigint): number {
  return convertToNumber(decimals, value);
}

function toUSDT(value: bigint, decimals: bigint, price: number): number {
  return convertToNumber(decimals, value) * price;
}
