import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './modules/auth/auth.module';
import { ApartmentModule } from './modules/apartments/apartment.module';
import { ResidentModule } from './modules/residents/resident.module';
import { TechnicianModule } from './modules/technicians/technician.module';
import { CategoryModule } from './modules/categories/category.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { WalletModule } from './modules/wallets/wallet.module';
import { PaymentModule } from './modules/payments/payment.module';
import { VacancyModule } from './modules/vacancies/vacancy.module';
import { ReviewModule } from './modules/reviews/review.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiModule } from './modules/ai/ai.module';
import { AuditModule } from './modules/audit/audit.module';
import { ReportsModule } from './modules/reports/reports.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: process.env.REDIS_URL ? new URL(process.env.REDIS_URL) : {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    AuthModule, 
    ApartmentModule, 
    ResidentModule, 
    TechnicianModule, 
    CategoryModule, 
    MaintenanceModule, 
    ChatModule, 
    NotificationModule,
    WalletModule,
    PaymentModule,
    VacancyModule,
    ReviewModule,
    AnalyticsModule,
    AiModule,
    AuditModule,
    ReportsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
