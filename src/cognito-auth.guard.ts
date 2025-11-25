import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { jwtDecode } from 'jwt-decode';

@Injectable()
export class CognitoAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // cho phép @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest();
    const auth = req.headers['authorization'] as string | undefined;
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = auth.slice(7);
    const payload: any = jwtDecode(token);

    req.user = {
      userId: payload.sub || payload['cognito:username'],
      // ví dụ: nếu thuộc group driver thì role = DRIVER, ngược lại PASSENGER
      role: payload['cognito:groups']?.includes('driver') ? 'DRIVER' : 'PASSENGER',
    };

    return true;
  }
}
