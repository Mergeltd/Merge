import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateMaintenanceRequestDto, CreateBookingDto } from '../dto/maintenance.dto';
import { RequestStatus, BookingStatus, RequestUrgency } from '@merge/database';

@Injectable()
export class MaintenanceRepository {
  constructor(private prisma: PrismaService) {}

  async createRequest(data: CreateMaintenanceRequestDto) {
    return this.prisma.maintenanceRequest.create({
      data: {
        title: data.title,
        description: data.description,
        urgency: data.urgency as RequestUrgency,
        status: RequestStatus.OPEN,
        resident: { connect: { id: data.residentId } },
        unit: { connect: { id: data.unitId } },
        category: { connect: { id: data.categoryId } },
        mediaKeys: data.mediaKeys,
      },
    });
  }

  async createBooking(data: CreateBookingDto) {
    return this.prisma.booking.create({
      data: {
        scheduledAt: new Date(data.scheduledAt),
        totalAmount: data.totalAmount,
        technician: { connect: { id: data.technicianId } },
        maintenanceRequest: { connect: { id: data.requestId } },
        status: BookingStatus.PROPOSED,
      },
    });
  }

  async updateBookingStatus(id: string, status: string) {
    return this.prisma.booking.update({
      where: { id },
      data: { status: status as BookingStatus },
    });
  }

  async updateRequestStatus(id: string, status: string) {
    return this.prisma.maintenanceRequest.update({
      where: { id },
      data: { status: status as RequestStatus },
    });
  }

  async findRequestsByResident(residentId: string) {
    return this.prisma.maintenanceRequest.findMany({
      where: { residentId },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findRequestsByCategory(categoryId: string) {
    return this.prisma.maintenanceRequest.findMany({
      where: { categoryId, status: RequestStatus.OPEN },
      include: { resident: { include: { user: true } }, unit: true },
    });
  }

  async findBookingsByTechnician(technicianId: string) {
    return this.prisma.booking.findMany({
      where: { technicianId },
      include: { maintenanceRequest: true },
      orderBy: { scheduledAt: 'asc' },
    });
  }
}
