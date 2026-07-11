import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateApartmentDto, CreateBuildingDto, CreateUnitDto } from '../dto/apartment.dto';
import { OccupancyStatus } from '@merge/database';

@Injectable()
export class ApartmentRepository {
  constructor(private prisma: PrismaService) {}

  async createApartment(data: CreateApartmentDto) {
    return this.prisma.apartment.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        country: data.country ?? 'Kenya',
        latitude: data.latitude,
        longitude: data.longitude,
        logoUrl: data.logoUrl,
      },
    });
  }

  async createBuilding(data: CreateBuildingDto) {
    return this.prisma.building.create({
      data: {
        name: data.name,
        apartment: {
          connect: { id: data.apartmentId },
        },
      },
    });
  }

  async createUnit(data: CreateUnitDto) {
    return this.prisma.unit.create({
      data: {
        number: data.number,
        floor: data.floor,
        rentAmount: data.rentAmount,
        status: OccupancyStatus.VACANT,
        building: {
          connect: { id: data.buildingId },
        },
      },
    });
  }

  async findApartmentById(id: string) {
    return this.prisma.apartment.findUnique({
      where: { id },
      include: { 
        buildings: { include: { units: true } },
        managers: { include: { manager: { include: { user: true } } } },
        landlords: { include: { landlord: { include: { user: true } } } }
      },
    });
  }
}
