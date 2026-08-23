import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../repositories/payment.repository';
import { InitiatePaymentDto, ProcessRevenueSplitDto } from '../dto/payment.dto';
import { WalletService } from '../../wallets/services/wallet.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly walletService: WalletService,
  ) {}

  async initiatePayment(dto: InitiatePaymentDto) {
    // Integration Point: M-Pesa Daraja API (STK Push) or Stripe Checkout
    console.log(`Initiating ${dto.paymentMethod} payment for booking ${dto.bookingId}...`);
    
    // For now, we simulate a successful external payment and deposit into the platform's escrow
    return {
      status: 'PENDING',
      checkoutUrl: 'https://checkout.stripe.com/pay/mock',
      transactionId: `TXN-${Date.now()}`,
    };
  }

  async processRevenueSplit(dto: ProcessRevenueSplitDto) {
    const { bookingId, totalAmount } = dto;

    // 1. Calculate Splits
    const platformFee = totalAmount * 0.10; // 10% Commission
    const remaining = totalAmount - platformFee;
    
    // In a real app, we'd fetch the Collaboration details to split among techs
    const leadTechShare = remaining; 
    const collabTechsShare = 0;

    // 2. Record the split in DB
    await this.paymentRepository.createRevenueShare({
      bookingId,
      totalAmount,
      platformFee,
      leadTechShare,
      collabTechsShare,
    });

    // 3. Distribute funds via Wallet transfers
    // Lead Tech Wallet
    await this.walletService.transfer({
      senderWalletId: 'PLATFORM_WALLET_ID', // Mock
      recipientWalletId: 'TECH_WALLET_ID', // Mock
      amount: leadTechShare,
      type: 'COLLABORATION_SPLIT',
      description: `Payment for booking ${bookingId}`,
    });

    // Platform Wallet
    await this.walletService.transfer({
      senderWalletId: 'ESCROW_WALLET_ID', // Mock
      recipientWalletId: 'PLATFORM_WALLET_ID', // Mock
      amount: platformFee,
      type: 'COMMISSION_FEE',
      description: `Commission for booking ${bookingId}`,
    });

    return { status: 'SETTLED', platformFee, leadTechShare };
  }
}
