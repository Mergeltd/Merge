import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  async logAction(userId: string, action: string, entityName: string, entityId: string, previousState?: any, newState?: any) {
    try {
      await this.prisma.auditLog.create({
        data: {
          userId,
          action,
          entityName,
          entityId,
          previousState: previousState || {},
          newState: newState || {},
        },
      });
      this.logger.log(`Audit Log: ${action} on ${entityName} by ${userId}`);
    } catch (error) {
      this.logger.error('Failed to log audit action', error);
      // In production, consider queuing to a secure log-sink
    }
  }
}
