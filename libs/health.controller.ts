import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('health')
  healthCheck() {
    return { status: 'healthy', timestamp: new Date().toISOString() };
  }
}
