import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AuthProxyController } from './auth-proxy.controller';
import { UsersProxyController } from './users-proxy.controller';
import { TripsProxyController } from './trips-proxy.controller';
import { DriversProxyController } from './drivers-proxy.controller';
import { HealthController } from './health.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard, Public } from './jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    HealthController,
    AuthProxyController,
    UsersProxyController,
    TripsProxyController,
    DriversProxyController,
  ],
  providers: [
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
