import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { AssignResidentDto } from '../dto/resident.dto';

@Injectable()
export class ResidentRepository {
  constructor(private prisma: PrismaService) {}

  async assignResident(data: AssignResidentDto) {
    return this.prisma.resident.create({
      data: {
        apartment: { connect: { id: data.apartmentId } },
        user: { connect: { id: data.userId } },
        unit: { connect: { id: data.unitId } },
        leaseStart: new Date(data.leaseStart),
        leaseEnd: data.leaseEnd ? new Date(data.leaseEnd) : undefined,
      },
    });
  }

  async findResidentsByApartment(apartmentId: string) {
    return this.prisma.resident.findMany({
      where: { apartmentId },
      include: { 
        user: true, 
        unit: true 
      },
    });
  }

  async removeResident(residentId: string) {
    return this.prisma.resident.delete({
      where: { id: residentId },
    });
  }
}
