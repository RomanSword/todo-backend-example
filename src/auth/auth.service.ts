import * as bcrypt from 'bcryptjs';

import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { MAX_AGE_ACCESS_TOKEN, MAX_AGE_REFRESH_TOKEN } from './const';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findByUsername(username);
    const isPasswordsSimular =
      user && (await bcrypt.compare(password, user.password));

    if (isPasswordsSimular) {
      const { password, ...result } = user;

      return result;
    }

    return null;
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    if (!user) throw new NotFoundException('user not found');

    const tokens = await this.generateTokens(user.id, user.username);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  register(body: RegisterDto) {
    return this.usersService.register(body);
  }

  async generateTokens(userId: string, username: string) {
    const payload = { sub: userId, username };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: MAX_AGE_ACCESS_TOKEN
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: MAX_AGE_REFRESH_TOKEN
      })
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);

    await this.usersService.updateRefreshToken(userId, hashed);
  }

  async logout(userId: string) {
    await this.usersService.updateRefreshToken(userId, '');
  }

  validateAccessToken(accessToken: string) {
    return this.validateToken(accessToken, process.env.JWT_ACCESS_SECRET);
  }

  validateRefreshToken(refreshToken: string) {
    return this.validateToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  }

  async validateToken(token: string, secret?: string) {
    const payload = await this.jwtService.verifyAsync(token, { secret });
    const user = await this.usersService.findOne(payload.sub);

    return user || null;
  }

  async generateAccessToken(username: string, userId: string) {
    return this.jwtService.sign(
      { username, sub: userId },
      {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '1d'
      }
    );
  }
}
