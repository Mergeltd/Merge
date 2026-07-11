import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class TechnicianPerformanceService {
  constructor(private prisma: PrismaService) {}

  async getPerformance(technicianId: string) {
    const technician = await this.prisma.technician.findUnique({
      where: { id: technicianId },
      include: { reviewsReceived: true },
    });

    if (!technician) throw new NotFoundException('Technician not found');

    const bookings = await this.prisma.booking.findMany({
      where: { technicianId, status: 'COMPLETED' },
      include: { maintenanceRequest: true },
    });

    const completedJobs = bookings.length;
    
    // Calculate performance metrics
    let totalResponseTime = 0;
    let totalCompletionTime = 0;

    bookings.forEach(b => {
      // Time to book: Booking Created - Request Created
      totalResponseTime += b.createdAt.getTime() - b.maintenanceRequest.createdAt.getTime();
      // Time to complete: UpdatedAt - ScheduledAt
      totalCompletionTime += b.updatedAt.getTime() - b.scheduledAt.getTime();
    });

    return {
      technicianId,
      completedJobs,
      averageRating: technician.averageRating,
      avgResponseTimeHours: completedJobs > 0 ? (totalResponseTime / completedJobs) / 3600000 : 0,
      avgCompletionTimeHours: completedJobs > 0 ? (totalCompletionTime / completedJobs) / 3600000 : 0,
    };
  }
}
