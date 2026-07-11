import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateTechnicianProfileDto, AddCategoryToTechDto } from '../dto/technician.dto';
import { TechStatus } from '@merge/database';

@Injectable()
export class TechnicianRepository {
  constructor(private prisma: PrismaService) {}

  async createProfile(data: CreateTechnicianProfileDto) {
    return this.prisma.technician.create({
      data: {
        user: { connect: { id: data.userId } },
        bio: data.bio,
        experienceYears: data.experienceYears,
        idNumber: data.idNumber,
        certifications: data.certifications,
        latitude: data.latitude,
        longitude: data.longitude,
        verificationStatus: TechStatus.PENDING_VERIFICATION,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.technician.update({
      where: { id },
      data: { verificationStatus: status as TechStatus },
    });
  }

  async addCategory(data: AddCategoryToTechDto) {
    return this.prisma.technicianCategory.create({
      data: {
        technician: { connect: { id: data.technicianId } },
        category: { connect: { id: data.categoryId } },
      },
    });
  }

  async findVerifiedTechnicians(categoryId?: string) {
    return this.prisma.technician.findMany({
      where: {
        verificationStatus: TechStatus.VERIFIED,
        isAvailable: true,
        categories: categoryId ? {
          some: { categoryId }
        } : undefined,
      },
      include: {
        user: true,
        categories: {
          include: { category: true }
        }
      }
    });
  }

  async findById(id: string) {
    return this.prisma.technician.findUnique({
      where: { id },
      include: { 
        user: true, 
        categories: { include: { category: true } } 
      }
    });
  }
}
