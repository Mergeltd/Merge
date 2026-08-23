import { useQuery } from '@tanstack/react-query';
import { getMyWallet, getMyTechnicianWallet, getWalletTransactions } from '@/queries/wallets';

export function useMyWallet(residentId: string | undefined) {
  return useQuery({
    queryKey: ['wallet', residentId],
    queryFn: () => getMyWallet(residentId!),
    enabled: !!residentId,
  });
}

export function useMyTechnicianWallet(technicianId: string | undefined) {
  return useQuery({
    queryKey: ['technician-wallet', technicianId],
    queryFn: () => getMyTechnicianWallet(technicianId!),
    enabled: !!technicianId,
  });
}

export function useWalletTransactions(walletId: string | undefined) {
  return useQuery({
    queryKey: ['wallet-transactions', walletId],
    queryFn: () => getWalletTransactions(walletId!),
    enabled: !!walletId,
  });
}
