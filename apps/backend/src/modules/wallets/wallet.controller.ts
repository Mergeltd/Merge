import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { WalletService } from './services/wallet.service';
import { DepositFundsDto, TransferFundsDto } from './dto/wallet.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('wallets')
@UseGuards(AuthGuard)
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('deposit')
  async deposit(@Body() dto: DepositFundsDto) {
    return this.walletService.deposit(dto);
  }

  @Post('transfer')
  async transfer(@Body() dto: TransferFundsDto) {
    return this.walletService.transfer(dto);
  }

  @Get('balance/:id')
  async getBalance(@Param('id') id: string) {
    return this.walletService.getBalance(id);
  }
}
