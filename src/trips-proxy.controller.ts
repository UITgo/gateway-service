import { Controller, Post, Get, Param, Body, Req, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

// TODO(ModuleA-CQRS): Gateway routes split between command and query services
// Write operations → trip-command-service
// Read operations → trip-query-service

@Controller('trips')
export class TripsProxyController {
  constructor(private readonly http: HttpService) {}

  // ===== Write Operations → trip-command-service =====
  
  @Post('quote')
  async quote(@Body() body: any) {
    const base = process.env.TRIP_COMMAND_BASE_URL || 'http://trip-command-service:3002';
    const res = await firstValueFrom(
      this.http.post(base + '/v1/trips/quote', body),
    );
    return res.data;
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const base = process.env.TRIP_COMMAND_BASE_URL || 'http://trip-command-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + '/v1/trips', body, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/cancel')
  async cancel(@Req() req: any, @Param('tripId') tripId: string, @Body() body: any) {
    const base = process.env.TRIP_COMMAND_BASE_URL || 'http://trip-command-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/v1/trips/${tripId}/cancel`, body, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/rate')
  async rate(@Req() req: any, @Param('tripId') tripId: string, @Body() body: any) {
    const base = process.env.TRIP_COMMAND_BASE_URL || 'http://trip-command-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/v1/trips/${tripId}/rate`, body, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/accept')
  async accept(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_COMMAND_BASE_URL || 'http://trip-command-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/v1/trips/${tripId}/accept`, {}, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/decline')
  async decline(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_COMMAND_BASE_URL || 'http://trip-command-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/v1/trips/${tripId}/decline`, {}, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/arrive-pickup')
  async arrive(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_COMMAND_BASE_URL || 'http://trip-command-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/v1/trips/${tripId}/arrive-pickup`, {}, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/start')
  async start(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_COMMAND_BASE_URL || 'http://trip-command-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/v1/trips/${tripId}/start`, {}, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/finish')
  async finish(@Req() req: any, @Param('tripId') tripId: string, @Body() body: any) {
    const base = process.env.TRIP_COMMAND_BASE_URL || 'http://trip-command-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/v1/trips/${tripId}/finish`, body, { headers }),
    );
    return res.data;
  }

  // ===== Read Operations → trip-query-service =====

  @Get(':tripId')
  async get(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_QUERY_BASE_URL || 'http://trip-query-service:3003';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.get(base + `/v1/trips/${tripId}`, { headers }),
    );
    return res.data;
  }

  @Get('users/:userId/trips')
  async getUserTrips(
    @Req() req: any,
    @Param('userId') userId: string,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    const base = process.env.TRIP_QUERY_BASE_URL || 'http://trip-query-service:3003';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const params: any = {};
    if (status) params.status = status;
    if (limit) params.limit = limit;
    if (offset) params.offset = offset;
    
    const res = await firstValueFrom(
      this.http.get(base + `/v1/trips/users/${userId}/trips`, { 
        params,
        headers 
      }),
    );
    return res.data;
  }
}
