import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateVacancyDto, ApplyToVacancyDto } from '../dto/vacancy.dto';
import { VacancyStatus, ApplicationStatus } from '@merge/database';

@Injectable()
export class VacancyRepository {
  constructor(private prisma: PrismaService) {}

  async createVacancy(data: CreateVacancyDto) {
    return this.prisma.vacancy.create({
      data: {
        title: data.title,
        description: data.description,
        rentAmount: data.rentAmount,
        depositAmount: data.depositAmount,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        mediaKeys: data.mediaKeys,
        status: VacancyStatus.PUBLISHED,
        unit: { connect: { id: data.unitId } },
        landlord: { connect: { id: data.landlordId } },
      },
    });
  }

  async findPublishedVacancies(filters: { category?: string, maxRent?: number }) {
    return this.prisma.vacancy.findMany({
      where: {
        status: VacancyStatus.PUBLISHED,
        rentAmount: filters.maxRent ? { lte: filters.maxRent } : undefined,
      },
      include: { 
        landlord: true,
        unit: true 
      },
    });
  }

  async applyToVacancy(data: ApplyToVacancyDto) {
    return this.prisma.vacancyApplication.create({
      data: {
        vacancy: { connect: { id: data.vacancyId } },
        applicant: { connect: { id: data.applicantId } },
        monthlyIncome: data.monthlyIncome,
        employerName: data.employerName,
        applicantNotes: data.applicantNotes,
        creditReportUrl: data.creditReportUrl,
        rentHistoryUrl: data.rentHistoryUrl,
        status: ApplicationStatus.SUBMITTED,
      },
    });
  }

  async updateApplicationStatus(id: string, status: string) {
    return this.prisma.vacancyApplication.update({
      where: { id },
      data: { status: status as ApplicationStatus },
    });
  }

  async findApplicationsByVacancy(vacancyId: string) {
    return this.prisma.vacancyApplication.findMany({
      where: { vacancyId },
      include: { applicant: true },
    });
  }
}
