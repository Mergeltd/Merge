import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ApartmentRepository } from '../repositories/apartment.repository';
import { CreateApartmentDto, CreateBuildingDto, CreateUnitDto } from '../dto/apartment.dto';
import { UserRole } from '@merge/shared-types';

@Injectable()
export class ApartmentService {
  constructor(private readonly repository: ApartmentRepository) {}

  async createApartment(user: any, dto: CreateApartmentDto) {
    if (user.role.name !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Super Admins can create new apartment complexes');
    }
    return this.repository.createApartment(dto);
  }

  async createBuilding(user: any, dto: CreateBuildingDto) {
    const apartment = await this.repository.findApartmentById(dto.apartmentId);
    
    // Check if user is a manager or landlord of this apartment
    const isOwnerOrManager = apartment?.managers.some(m => m.manager.userId === user.id) || 
                             apartment?.landlords.some(l => l.landlord.userId === user.id);

    if (!apartment || !isOwnerOrManager) {
        throw new ForbiddenException('You do not have permission to modify this apartment');
    }
    return this.repository.createBuilding(dto);
  }

  async createUnit(user: any, dto: CreateUnitDto) {
    return this.repository.createUnit(dto);
  }

  async getApartmentDetails(user: any, id: string) {
    const apartment = await this.repository.findApartmentById(id);
    if (!apartment) throw new NotFoundException('Apartment complex not found');
    
    // Check if user is a manager or landlord of this apartment
    const isAuthorized = apartment.managers.some(m => m.manager.userId === user.id) || 
                         apartment.landlords.some(l => l.landlord.userId === user.id);

    if (user.role.name !== UserRole.SUPER_ADMIN && !isAuthorized) {
        throw new ForbiddenException('Access denied to this apartment');
    }
    
    return apartment;
  }
}
