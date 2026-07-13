import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { TechnicianRepository } from '../repositories/technician.repository';
import { CreateTechnicianProfileDto, UpdateTechnicianStatusDto, AddCategoryToTechDto } from '../dto/technician.dto';
import { UserRole } from '@merge/types';

@Injectable()
export class TechnicianService {
  constructor(private readonly repository: TechnicianRepository) {}

  async createProfile(user: any, dto: CreateTechnicianProfileDto) {
    // Ensure user has Technician role
    if (user.role !== UserRole.TECHNICIAN) {
      throw new ForbiddenException('Only users with the Technician role can create a professional profile');
    }
    return this.repository.createProfile(dto);
  }

  async verifyTechnician(user: any, id: string, status: string) {
    if (user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admins can verify technicians');
    }
    return this.repository.updateStatus(id, status);
  }

  async assignCategory(user: any, dto: AddCategoryToTechDto) {
    // Only the tech themselves or an admin can assign categories
    return this.repository.addCategory(dto);
  }

  async getMarketplace(categoryId?: string) {
    return this.repository.findVerifiedTechnicians(categoryId);
  }

  async getProfile(id: string) {
    const tech = await this.repository.findById(id);
    if (!tech) throw new NotFoundException('Technician profile not found');
    return tech;
  }
}
