import { Controller, Get } from '@nestjs/common';
import { Public } from './jwt-auth.guard';

@Controller()
export class HealthController {
  @Public()
  @Get('healthz')
  healthz() {
    return { status: 'ok' };
  }
}

