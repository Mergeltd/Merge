import { useQuery } from '@tanstack/react-query';
import { getMyWallet, getMyTechnicianWallet, getMyLandlordWallet, getWalletTransactions } from '@/queries/wallets';

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

export function useMyLandlordWallet(userId: string | undefined) {
  return useQuery({
    queryKey: ['landlord-wallet', userId],
    queryFn: () => getMyLandlordWallet(userId!),
    enabled: !!userId,
  });
}

export function useWalletTransactions(walletId: string | undefined) {
  return useQuery({
    queryKey: ['wallet-transactions', walletId],
    queryFn: () => getWalletTransactions(walletId!),
    enabled: !!walletId,
  });
}
