import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class ForecastingService {
  constructor(private prisma: PrismaService) {}

  async getRevenueForecast() {
    // Get last 6 months of revenue
    const historical = await this.prisma.$queryRaw`
      SELECT month, total_revenue 
      FROM mv_monthly_revenue 
      ORDER BY month DESC 
      LIMIT 6;
    ` as any[];

    // Simple Linear Regression forecast for next month
    if (historical.length < 2) return { forecast: 0 };
    
    // Simple average growth rate
    let growth = 0;
    for (let i = 0; i < historical.length - 1; i++) {
        growth += (Number(historical[i].total_revenue) - Number(historical[i+1].total_revenue));
    }
    const avgGrowth = growth / (historical.length - 1);
    
    return { 
        forecast: Number(historical[0].total_revenue) + avgGrowth 
    };
  }

  async getOccupancyForecast() {
    // Forecast based on current vacancy rate
    const totalUnits = await this.prisma.unit.count();
    const vacantUnits = await this.prisma.unit.count({ where: { status: 'VACANT' } });
    
    // Very simple linear projection
    return {
        forecastedOccupancyRate: totalUnits > 0 ? ((totalUnits - vacantUnits) / totalUnits) * 100 : 0
    };
  }
}
