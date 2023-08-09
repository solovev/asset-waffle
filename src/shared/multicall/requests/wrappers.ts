import { MulticallRequest } from "@/shared";

import ERC20ABI from "@/shared/multicall/abi/ERC20.json";
import PoolABI from "@/shared/multicall/abi/Pool.json";
import PancakeSwapV2 from "@/shared/multicall/abi/PancakeSwapV2.json";

export function createPoolRequest(
  address: string,
  functionName: string,
  args: NonNullable<unknown>[] = [],
  takeValues?: number[]
): MulticallRequest {
  return {
    address: address,
    abi: PoolABI,
    functionName,
    args,
    takeValues,
  };
}

export function createERC20Request(
  address: string,
  functionName: string,
  args: NonNullable<unknown>[] = []
): MulticallRequest {
  return {
    address: address,
    abi: ERC20ABI,
    functionName,
    args,
  };
}

export function createPancakeSwapRequest(
  functionName: string,
  args: NonNullable<unknown>[] = []
): MulticallRequest {
  return {
    address: import.meta.env.VITE_PANCAKE_SWAP_ROUTER_V2_ADDRESS,
    abi: PancakeSwapV2,
    functionName,
    args,
  };
}
