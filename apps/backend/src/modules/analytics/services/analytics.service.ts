import { Injectable } from '@nestjs/common';
import { AnalyticsRepository } from '../repositories/analytics.repository';

@Injectable()
export class AnalyticsService {
  constructor(private readonly repository: AnalyticsRepository) {}

  async getDashboardStats() {
    const [totalUsers, totalRevenue, buildings, jobs] = await Promise.all([
      this.repository.getTotalUsers(),
      this.repository.getTotalRevenue(),
      this.repository.getActiveBuildingsCount(),
      this.repository.getCompletedJobsCount(),
    ]);

    return {
      totalUsers,
      totalRevenue,
      activeBuildings: buildings,
      completedJobs: jobs,
    };
  }

  async getRevenueChart() {
    return this.repository.getMonthlyRevenue();
  }
}
