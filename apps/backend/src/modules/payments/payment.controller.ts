import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './services/payment.service';
import { InitiatePaymentDto, ProcessRevenueSplitDto } from './dto/payment.dto';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('payments')
@UseGuards(AuthGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('initiate')
  async initiate(@Body() dto: InitiatePaymentDto) {
    return this.paymentService.initiatePayment(dto);
  }

  @Post('split')
  async split(@Body() dto: ProcessRevenueSplitDto) {
    return this.paymentService.processRevenueSplit(dto);
  }
}
