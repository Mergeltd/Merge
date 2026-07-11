import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { MaintenanceRepository } from './repositories/maintenance.repository';

@Processor('maintenance-jobs')
@Injectable()
export class MaintenanceProcessor extends WorkerHost {
  private readonly logger = new Logger(MaintenanceProcessor.name);

  constructor(private readonly repository: MaintenanceRepository) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`Processing background job: ${job.name} (ID: ${job.id})`);
    
    switch (job.name) {
      case 'assign-technician': {
        const { bookingId, requestId } = job.data;
        this.logger.log(`Asynchronously updating request ${requestId} to ASSIGNED for booking ${bookingId}`);
        await this.repository.updateRequestStatus(requestId, 'ASSIGNED');
        return { success: true, bookingId, requestId };
      }
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
        throw new Error(`Unsupported job: ${job.name}`);
    }
  }
}
