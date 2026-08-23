import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PaymentRepository {
  private prisma = new PrismaClient();

  async createRevenueShare(data: {
    bookingId: string,
    totalAmount: number,
    platformFee: number,
    leadTechShare: number,
    collabTechsShare: number
  }) {
    return this.prisma.revenueShare.create({ data });
  }

  async getRevenueShare(bookingId: string) {
    return this.prisma.revenueShare.findUnique({
      where: { bookingId },
    });
  }
}
