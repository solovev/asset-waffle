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

export interface SumAggregatedData extends Balances {
  inWallets: Balances;
  inPools: PoolBalance;
  pools: Record<string, PoolBalance>;
}

export interface AggregatedData {
  asset: { decimals: number; supply: number; symbol: string; price: number };
  wallets: { [wallet: string]: SumAggregatedData };
  pools: { [pool: string]: { vesting: number } };
  hasErrors: boolean;
}

export async function fetchAndAggregateData(
  pools: string[],
  walletAddresses: string[]
): Promise<AggregatedData> {
  const {
    assets,
    vesting,
    balances: walletBalancesInPools,
  } = await getBalances(pools, walletAddresses);

  const listOfAssets = Array.from(new Set(Object.values(assets)));
  if (listOfAssets.length > 1) {
    throw new Error("Multiple assets are not supported");
  }

  const [asset] = listOfAssets;

  const { decimals, supply, symbol, walletBalances } = await getAssetData(
    asset,
    walletAddresses
  );

  const price = await getPrice(decimals, asset);

  let hasErrors = price === 0;
  const wallets: AggregatedData["wallets"] = {};

  for (const walletAddress of walletAddresses) {
    const walletBalance = walletBalances[walletAddress];
    hasErrors ||= walletBalance.hasError;

    const balance = (wallets[walletAddress] = getDefaultSumAggregatedData());

    balance.inWallets.balance = toNumber(walletBalance.value, decimals);
    balance.inWallets.balanceUSDT = toUSDT(
      walletBalance.value,
      decimals,
      price
    );

    balance.balance += balance.inWallets.balance;
    balance.balanceUSDT += balance.inWallets.balanceUSDT;

    for (const pool of pools) {
      const { pendingReward, userInfo } =
        walletBalancesInPools[walletAddress][pool];
      const balanceInPool = {
        reward: {
          balance: toNumber(pendingReward.value, decimals),
          balanceUSDT: toUSDT(pendingReward.value, decimals, price),
        },
        staked: {
          balance: toNumber(userInfo.value, decimals),
          balanceUSDT: toUSDT(userInfo.value, decimals, price),
        },
      };

      balance.inPools.reward.balance += balanceInPool.reward.balance;
      balance.inPools.reward.balanceUSDT += balanceInPool.reward.balanceUSDT;
      balance.inPools.staked.balance += balanceInPool.staked.balance;
      balance.inPools.staked.balanceUSDT += balanceInPool.staked.balanceUSDT;

      balance.balance +=
        balanceInPool.reward.balance + balanceInPool.staked.balance;
      balance.balanceUSDT +=
        balanceInPool.reward.balanceUSDT + balanceInPool.staked.balanceUSDT;

      balance.pools[pool] = balanceInPool;

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
    wallets,
    hasErrors,
  };
}

function mapPools(vesting: Record<string, bigint>): AggregatedData["pools"] {
  return Object.keys(vesting).reduce((map, pool) => {
    map[pool] = { vesting: Number(vesting[pool]) / 60 / 60 / 24 };
    return map;
  }, {} as AggregatedData["pools"]);
}

export function sumAggregatedData(forWallets: string[], data: AggregatedData) {
  return forWallets.reduce((sumAggregatedData, wallet) => {
    const { balance, balanceUSDT, inWallets, inPools, pools } =
      data.wallets[wallet];

    sumAggregatedData.balance += balance;
    sumAggregatedData.balanceUSDT += balanceUSDT;

    sumAggregatedData.inWallets.balance += inWallets.balance;
    sumAggregatedData.inWallets.balanceUSDT += inWallets.balanceUSDT;

    sumAggregatedData.inPools.reward.balance += inPools.reward.balance;
    sumAggregatedData.inPools.reward.balanceUSDT += inPools.reward.balanceUSDT;
    sumAggregatedData.inPools.staked.balance += inPools.staked.balance;
    sumAggregatedData.inPools.staked.balanceUSDT += inPools.staked.balanceUSDT;

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
  }, getDefaultSumAggregatedData());
}

export function getDefaultSumAggregatedData(): SumAggregatedData {
  return {
    balance: 0,
    balanceUSDT: 0,
    pools: {},
    inWallets: {
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
  };
}

export function getDefaultAggregatedData(): AggregatedData {
  return {
    asset: {
      decimals: 0,
      supply: 0,
      symbol: "Unknown",
      price: 0,
    },
    pools: {},
    wallets: {},
    hasErrors: false,
  };
}

function toNumber(value: bigint, decimals: bigint): number {
  return convertToNumber(decimals, value);
}

function toUSDT(value: bigint, decimals: bigint, price: number): number {
  return convertToNumber(decimals, value) * price;
}
