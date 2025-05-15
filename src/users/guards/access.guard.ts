import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { UsersService } from '../users.service';
import { User } from '../entities/user.entity';

/*
  Идея этого гварда заключается в том, что пользователь
  может обновлять только свой профиль. Делать что-то
  с другими профилями может только если он является админом.
*/

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const targetUserId = req.params?.id;
    const accessToken = req.cookies?.access_token;
    const onlyForAdmin = this.reflector.get(
      'onlyForAdmin',
      context.getHandler()
    );

    if (!accessToken) {
      throw new UnauthorizedException('access token not found');
    }

    const payload = await this.jwtService.verifyAsync(accessToken, {
      secret: process.env.JWT_ACCESS_SECRET
    });
    const userId = payload.sub;

    let currentUser: User | null = null;

    try {
      currentUser = await this.usersService.findOne(userId);
    } catch {
      throw new UnauthorizedException('invalid access token');
    }

    if (
      (currentUser?.id === targetUserId && !onlyForAdmin) ||
      currentUser?.isAdmin
    ) {
      req.user = currentUser;

      return true;
    }

    throw new UnauthorizedException('access denied');
  }
}
