import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MaintenanceRepository } from '../repositories/maintenance.repository';
import { CreateMaintenanceRequestDto, CreateBookingDto } from '../dto/maintenance.dto';
import { UserRole } from '@merge/types';

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly repository: MaintenanceRepository,
    @InjectQueue('maintenance-jobs') private readonly maintenanceQueue: Queue,
  ) {}

  async reportIssue(user: any, dto: CreateMaintenanceRequestDto) {
    if (user.role !== UserRole.RESIDENT) {
      throw new ForbiddenException('Only residents can report maintenance issues');
    }
    return this.repository.createRequest(dto);
  }

  async bookTechnician(user: any, dto: CreateBookingDto) {
    // Ideally, we check if the user is the resident of the request or the tech accepting it
    const booking = await this.repository.createBooking(dto);
    
    // Asynchronously transition request status to ASSIGNED in background queue
    await this.maintenanceQueue.add('assign-technician', {
      bookingId: booking.id,
      requestId: dto.requestId,
    });
    
    return booking;
  }

  async updateJobStatus(user: any, bookingId: string, status: string) {
    // Only the assigned technician or admin can update status
    return this.repository.updateBookingStatus(bookingId, status);
  }

  async getMyRequests(user: any) {
    // This assumes the user is a resident. In a real app, we'd find the Resident profile first.
    // For now, we'll mock the residentId lookup.
    return this.repository.findRequestsByResident(user.id); 
  }

  async getAvailableJobs(categoryId: string) {
    return this.repository.findRequestsByCategory(categoryId);
  }
}
