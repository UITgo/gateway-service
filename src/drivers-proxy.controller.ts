import {
  Controller,
  Post,
  Put,
  Get,
  Param,
  Body,
  Req,
  Res,
  Query,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Response } from 'express';

@Controller('drivers')
export class DriversProxyController {
  constructor(private readonly http: HttpService) {}

  @Get('nearby')
  async nearby(
    @Req() req: any,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
    @Query('radius') radius?: string,
    @Query('limit') limit?: string,
  ) {
    const base = process.env.DRIVER_STREAM_BASE_URL || 'http://driver-stream:8080';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    
    const params: any = {};
    if (lat) params.lat = lat;
    if (lng) params.lng = lng;
    if (radius) params.radius = radius;
    if (limit) params.limit = limit;
    
    const res = await firstValueFrom(
      this.http.get(base + '/v1/drivers/nearby', { 
        params,
        headers 
      }),
    );
    return res.data;
  }

  @Post(':id/status')
  async status(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const base = process.env.DRIVER_STREAM_BASE_URL || 'http://driver-stream:8080';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.post(base + `/v1/drivers/${id}/status`, body, { headers }),
    );
    return res.data;
  }

  @Put(':id/location')
  async location(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const base = process.env.DRIVER_STREAM_BASE_URL || 'http://driver-stream:8080';
    const headers = {
      'X-User-Id': req.user.userId,
      'X-User-Role': req.user.role,
    };
    const res = await firstValueFrom(
      this.http.put(base + `/v1/drivers/${id}/location`, body, { headers }),
    );
    return res.data;
  }

  @Get(':id/events')
  async events(
    @Req() req: any,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const base = process.env.DRIVER_STREAM_BASE_URL || 'http://driver-stream:8080';

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const axiosRes = await firstValueFrom(
      this.http.get(base + `/v1/drivers/${id}/events`, {
        responseType: 'stream',
      }),
    );

    axiosRes.data.pipe(res);
  }
}
