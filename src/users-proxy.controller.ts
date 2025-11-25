import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Public } from './jwt-auth.guard';

@Controller('users')
export class UsersProxyController {
  constructor(private readonly http: HttpService) {}

  @Public()
  @Post()
  async create(@Body() body: any) {
    const base = process.env.USER_BASE_URL || 'http://user-service:3001';
    const res = await firstValueFrom(
      this.http.post(base + '/v1/users', body),
    );
    return res.data;
  }

  @Get('me')
  async me(@Req() req: any) {
    const base = process.env.USER_BASE_URL || 'http://user-service:3001';

    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };

    const res = await firstValueFrom(
      this.http.get(base + '/v1/users/me', { headers }),
    );
    return res.data;
  }
}
