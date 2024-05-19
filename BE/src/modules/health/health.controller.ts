import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  @Get()
  async healthCheck(): Promise<any> {
    return {
      name: 'Materialize',
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
    };
  }
}
