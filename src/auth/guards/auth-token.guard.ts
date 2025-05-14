import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthService } from '../auth.service';
import { COOKIE_CONFIG, MAX_AGE_ACCESS_TOKEN } from '../const';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const accessToken = req.cookies?.access_token;
    const refreshToken = req.cookies?.refresh_token;

    try {
      if (!accessToken) {
        throw new Error();
      }

      const user = await this.authService.validateAccessToken(accessToken);

      if (!user) {
        throw new Error();
      }

      req.user = user;

      return true;
    } catch (err) {
      if (!refreshToken) {
        throw new UnauthorizedException('all tokens expired');
      }

      const user = await this.authService.validateRefreshToken(refreshToken);

      if (!user) throw new UnauthorizedException('invalid refresh token');

      const newAccessToken = await this.authService.generateAccessToken(
        user.username,
        user.id
      );
      console.log('GENERATE NEW ACCESS TOKEN: ', newAccessToken);
      res.cookie('access_token', newAccessToken, {
        ...COOKIE_CONFIG,
        maxAge: MAX_AGE_ACCESS_TOKEN
      });

      req.user = user;

      return true;
    }
  }
}
