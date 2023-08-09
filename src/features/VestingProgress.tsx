import { useDataContext, useStaticDataContext } from "@/app/providers";
import { TimeProgress } from "@/entities";

interface Props {
  poolAddress: string;
  walletAddress: string | null;
}

export const VestingProgress: React.FC<Props> = ({
  poolAddress,
  walletAddress,
}) => {
  const { wallets } = useStaticDataContext();
  const { data } = useDataContext();

  const { vesting } = data.pools[poolAddress];

  const progresses = wallets.reduce((info, wallet) => {
    const { lastDepositedAt, staked, reward } =
      data.wallets[wallet.address].pools[poolAddress];
    const deposited = staked.balance + reward.balance;
    if (!lastDepositedAt || !deposited) {
      return info;
    }

    const now = Math.floor(Date.now() / 1000);
    const progress = Math.min((now - lastDepositedAt) / vesting, 1);
    return { ...info, [wallet.address]: progress };
  }, {} as Record<string, number>);

  const progress = getProgress(progresses, walletAddress);
  return (
    <div>
      <TimeProgress passed={progress * vesting} total={vesting} mean={!walletAddress} />
    </div>
  );
};

function getProgress(
  progresses: Record<string, number>,
  walletAddress: string | null
) {
  if (walletAddress) {
    return progresses[walletAddress] ?? 0;
  }
  const list = Object.values(progresses);
  if (!list.length) {
    return 0;
  }
  return list.reduce((sum, progress) => sum + progress, 0) / list.length;
}
