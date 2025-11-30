import { Controller, Post, Body } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Public } from './jwt-auth.guard';

@Controller('sessions')
export class AuthProxyController {
  constructor(private readonly http: HttpService) {}

  @Public()
  @Post()
  async login(@Body() body: any) {
    const base = process.env.AUTH_BASE_URL || 'http://auth-service:3000';
    const res = await firstValueFrom(
      this.http.post(base + '/v1/auth/login', body),
    );
    return res.data;
  }

  @Public()
  @Post('demo/seed')
  async demoSeed(@Body() body: any) {
    const base = process.env.AUTH_BASE_URL || 'http://auth-service:3000';
    const res = await firstValueFrom(
      this.http.post(base + '/v1/auth/demo/seed', body),
    );
    return res.data;
  }

  @Public()
  @Post('demo/login')
  async demoLogin(@Body() body: any) {
    const base = process.env.AUTH_BASE_URL || 'http://auth-service:3000';
    const res = await firstValueFrom(
      this.http.post(base + '/v1/auth/demo/login', body),
    );
    return res.data;
  }
}
