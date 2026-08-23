import { Injectable } from '@nestjs/common';
import { ReviewRepository } from '../repositories/review.repository';
import { CreateReviewDto } from '../dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly repository: ReviewRepository) {}

  async submitReview(user: any, dto: CreateReviewDto) {
    // In a real app, we'd verify that the user was part of the booking
    const review = await this.repository.createReview(dto, user.id);
    
    // Recalculate and update technician's average rating
    const newAverage = await this.repository.calculateAverageRating(dto.targetTechnicianId);
    await this.repository.updateTechnicianRating(dto.targetTechnicianId, newAverage);
    
    return review;
  }

  async getTechnicianReviews(technicianId: string) {
    return this.repository.getReviewsByTechnician(technicianId);
  }
}
