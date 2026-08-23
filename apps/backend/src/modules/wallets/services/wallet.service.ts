import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { WalletRepository } from '../repositories/wallet.repository';
import { DepositFundsDto, TransferFundsDto } from '../dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(private readonly repository: WalletRepository) {}

  async ensureWalletExists(userId: string, type: string) {
    let wallet = await this.repository.findWalletByUserId(userId, type);
    if (!wallet) {
      wallet = await this.repository.createWallet({
        walletType: type as any,
        userId: userId,
      });
    }
    return wallet;
  }

  async deposit(dto: DepositFundsDto) {
    // Integration Point: Verify payment with M-Pesa/Stripe here
    const reference = `DEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return this.repository.executeTransaction(
      null, 
      dto.walletId, 
      dto.amount, 
      'DEPOSIT', 
      reference, 
      dto.gateway
    );
  }

  async transfer(dto: TransferFundsDto) {
    const reference = `TRF-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    return this.repository.executeTransaction(
      dto.senderWalletId, 
      dto.recipientWalletId, 
      dto.amount, 
      dto.type, 
      reference, 
      'WALLET'
    );
  }

  async getBalance(walletId: string) {
    const wallet = await this.repository.findWalletById(walletId);
    if (!wallet) throw new InternalServerErrorException('Wallet not found');
    return wallet.balance;
  }
}
