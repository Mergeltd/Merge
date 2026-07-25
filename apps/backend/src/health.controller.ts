import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthController {
  @Get()
  getHealth() {
    return { status: 'ok', message: 'MERGE API is live' };
  }
}
