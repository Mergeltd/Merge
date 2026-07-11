import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class SubscriptionAnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getMrr() {
    // MRR: Sum of monthly subscription prices for ACTIVE subscriptions
    const mrr = await this.prisma.subscription.aggregate({
      where: { status: 'ACTIVE', billingPeriod: 'MONTHLY' },
      _sum: { price: true },
    });
    return { mrr: mrr._sum.price || 0 };
  }

  async getChurnRate() {
    // Churn: (Subscriptions expired/cancelled in last month / Total active at start of last month) * 100
    const now = new Date();
    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));

    const lost = await this.prisma.subscription.count({
      where: {
        status: 'CANCELLED',
        updatedAt: { gte: lastMonth },
      },
    });

    const total = await this.prisma.subscription.count({
      where: { status: 'ACTIVE' },
    });

    return { churnRate: total > 0 ? (lost / total) * 100 : 0 };
  }
}
