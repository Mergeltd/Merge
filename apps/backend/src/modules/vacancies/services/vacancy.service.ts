import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { VacancyRepository } from '../repositories/vacancy.repository';
import { CreateVacancyDto, ApplyToVacancyDto } from '../dto/vacancy.dto';
import { UserRole } from '@merge/types';

@Injectable()
export class VacancyService {
  constructor(private readonly repository: VacancyRepository) {}

  async listVacancies(filters: any) {
    return this.repository.findPublishedVacancies(filters);
  }

  async createListing(user: any, dto: CreateVacancyDto) {
    if (user.role !== UserRole.LANDLORD && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only landlords or admins can list vacancies');
    }
    return this.repository.createVacancy(dto);
  }

  async submitApplication(user: any, dto: ApplyToVacancyDto) {
    // Ensure the applicant is the authenticated user
    if (dto.applicantId !== user.id) {
      throw new ForbiddenException('You can only apply as yourself');
    }
    return this.repository.applyToVacancy(dto);
  }

  async reviewApplication(user: any, applicationId: string, status: string) {
    if (user.role !== UserRole.LANDLORD && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only landlords or admins can review applications');
    }
    return this.repository.updateApplicationStatus(applicationId, status);
  }

  async getApplications(user: any, vacancyId: string) {
    // In a real app, we'd verify that the user owns the vacancy
    return this.repository.findApplicationsByVacancy(vacancyId);
  }
}
