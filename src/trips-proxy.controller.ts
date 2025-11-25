import { Controller, Post, Get, Param, Body, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('trips')
export class TripsProxyController {
  constructor(private readonly http: HttpService) {}

  @Post('quote')
  async quote(@Body() body: any) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const res = await firstValueFrom(
      this.http.post(base + '/trips/quote', body),
    );
    return res.data;
  }

  @Post()
  async create(@Req() req: any, @Body() body: any) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + '/trips', body, { headers }),
    );
    return res.data;
  }

  @Get(':tripId')
  async get(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.get(base + `/trips/${tripId}`, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/cancel')
  async cancel(@Req() req: any, @Param('tripId') tripId: string, @Body() body: any) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/trips/${tripId}/cancel`, body, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/rate')
  async rate(@Req() req: any, @Param('tripId') tripId: string, @Body() body: any) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/trips/${tripId}/rate`, body, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/accept')
  async accept(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/trips/${tripId}/accept`, {}, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/decline')
  async decline(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/trips/${tripId}/decline`, {}, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/arrive-pickup')
  async arrive(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/trips/${tripId}/arrive-pickup`, {}, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/start')
  async start(@Req() req: any, @Param('tripId') tripId: string) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/trips/${tripId}/start`, {}, { headers }),
    );
    return res.data;
  }

  @Post(':tripId/finish')
  async finish(@Req() req: any, @Param('tripId') tripId: string, @Body() body: any) {
    const base = process.env.TRIP_BASE_URL || 'http://trip-service:3002';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/trips/${tripId}/finish`, body, { headers }),
    );
    return res.data;
  }
}
