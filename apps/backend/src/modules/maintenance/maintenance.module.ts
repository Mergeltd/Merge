import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceService } from './services/maintenance.service';
import { MaintenanceRepository } from './repositories/maintenance.repository';
import { MaintenanceProcessor } from './maintenance.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'maintenance-jobs',
    }),
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService, MaintenanceRepository, MaintenanceProcessor],
  exports: [MaintenanceService],
})
export class MaintenanceModule {}
