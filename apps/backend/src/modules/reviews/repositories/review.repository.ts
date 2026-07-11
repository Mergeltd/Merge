import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewRepository {
  constructor(private prisma: PrismaService) {}

  async createReview(data: CreateReviewDto, authorId: string) {
    return this.prisma.review.create({
      data: {
        rating: data.rating,
        qualityRating: data.qualityRating,
        speedRating: data.speedRating,
        professionalismRating: data.professionalismRating,
        comment: data.comment,
        author: { connect: { id: authorId } },
        booking: { connect: { id: data.bookingId } },
        targetTechnician: { connect: { id: data.targetTechnicianId } },
      },
    });
  }

  async getReviewsByTechnician(technicianId: string) {
    return this.prisma.review.findMany({
      where: { targetTechnicianId: technicianId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async calculateAverageRating(technicianId: string) {
    const aggregate = await this.prisma.review.aggregate({
      where: { targetTechnicianId: technicianId },
      _avg: { rating: true },
    });
    return aggregate._avg.rating || 0;
  }

  async updateTechnicianRating(technicianId: string, newAverage: number) {
    return this.prisma.technician.update({
      where: { id: technicianId },
      data: { averageRating: newAverage },
    });
  }
}
