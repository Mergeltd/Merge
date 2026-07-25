import { Injectable, ForbiddenException } from '@nestjs/common';
import { ResidentRepository } from '../repositories/resident.repository';
import { AssignResidentDto } from '../dto/resident.dto';
import { UserRole } from '@merge/types';

@Injectable()
export class ResidentService {
  constructor(private readonly repository: ResidentRepository) {}

  async assignToApartment(user: any, dto: AssignResidentDto) {
    if (user.role !== UserRole.APARTMENT_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only Apartment Admins or Super Admins can assign residents');
    }
    return this.repository.assignResident(dto);
  }

  async getApartmentResidents(apartmentId: string) {
    return this.repository.findResidentsByApartment(apartmentId);
  }

  async removeResident(user: any, residentId: string) {
    if (user.role !== UserRole.APARTMENT_ADMIN && user.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Unauthorized to remove residents');
    }
    return this.repository.removeResident(residentId);
  }
}
