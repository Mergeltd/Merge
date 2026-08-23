import { useQuery } from '@tanstack/react-query';
import { getMyWallet, getWalletTransactions } from '@/queries/wallets';

export function useMyWallet(residentId: string | undefined) {
  return useQuery({
    queryKey: ['wallet', residentId],
    queryFn: () => getMyWallet(residentId!),
    enabled: !!residentId,
  });
}

export function useWalletTransactions(walletId: string | undefined) {
  return useQuery({
    queryKey: ['wallet-transactions', walletId],
    queryFn: () => getWalletTransactions(walletId!),
    enabled: !!walletId,
  });
}
