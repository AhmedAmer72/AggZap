'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { ZAP_SENDER_ABI, ERC20_ABI } from '@/lib/contracts';
import { CONTRACTS, NETWORKS } from '@/lib/config';

interface UseZapProps {
  tokenAddress: string;
  amount: string;
  destinationNetwork: number;
  receiverAddress: string;
}

export function useZap() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approveToken = async (tokenAddress: string, amount: bigint, spender: string) => {
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender as `0x${string}`, amount],
    });
  };

  const zapLiquidity = async ({
    tokenAddress,
    amount,
    destinationNetwork,
    receiverAddress,
  }: UseZapProps) => {
    const amountInWei = parseUnits(amount, 6); // Assuming USDC with 6 decimals
    
    writeContract({
      address: CONTRACTS.TESTNET.ZAP_SENDER as `0x${string}`,
      abi: ZAP_SENDER_ABI,
      functionName: 'zapLiquidity',
      args: [
        receiverAddress as `0x${string}`,
        tokenAddress as `0x${string}`,
        amountInWei,
        destinationNetwork,
      ],
    });
  };

  const zapLiquidityETH = async (
    destinationNetwork: number,
    receiverAddress: string,
    amount: string
  ) => {
    const amountInWei = parseUnits(amount, 18);
    
    writeContract({
      address: CONTRACTS.TESTNET.ZAP_SENDER as `0x${string}`,
      abi: ZAP_SENDER_ABI,
      functionName: 'zapLiquidityETH',
      args: [receiverAddress as `0x${string}`, destinationNetwork],
      value: amountInWei,
    });
  };

  return {
    approveToken,
    zapLiquidity,
    zapLiquidityETH,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

export function useTokenBalance(tokenAddress: string, userAddress: string | undefined) {
  const { data, isLoading, refetch } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && !!tokenAddress,
    },
  });

  return {
    balance: data ? formatUnits(data, 6) : '0',
    isLoading,
    refetch,
  };
}

export function useZapStats() {
  const { data, isLoading } = useReadContract({
    address: CONTRACTS.TESTNET.ZAP_SENDER as `0x${string}`,
    abi: ZAP_SENDER_ABI,
    functionName: 'getStats',
  });

  return {
    stats: data ? {
      totalZaps: data[0].toString(),
      totalVolume: formatUnits(data[1], 6),
      feeBps: data[2].toString(),
    } : null,
    isLoading,
  };
}

export function useCalculateFee(amount: string) {
  const { data } = useReadContract({
    address: CONTRACTS.TESTNET.ZAP_SENDER as `0x${string}`,
    abi: ZAP_SENDER_ABI,
    functionName: 'calculateFee',
    args: amount ? [parseUnits(amount, 6)] : undefined,
    query: {
      enabled: !!amount && parseFloat(amount) > 0,
    },
  });

  return {
    fee: data ? formatUnits(data, 6) : '0',
  };
}
