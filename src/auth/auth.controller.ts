import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Serialize } from 'src/common/decorators';
import { GetUserDto } from 'src/users/dto/get-user.dto';

import { AuthService } from './auth.service';
import {
  COOKIE_CONFIG,
  MAX_AGE_ACCESS_TOKEN,
  MAX_AGE_REFRESH_TOKEN
} from './const';
import { AuthTokenGuard } from './guards/auth-token.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Serialize(GetUserDto)
  @ApiOperation({ summary: 'Регистрация пользователя' })
  register(@Res({ passthrough: true }) res, @Body() body: RegisterDto) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return this.authService.register(body);
  }

  @Post('login')
  @ApiOperation({ summary: 'Вход пользователя' })
  async login(@Res({ passthrough: true }) res, @Body() body: LoginDto) {
    const tokens = await this.authService.login(body.username, body.password);

    res.cookie('access_token', tokens.accessToken, {
      ...COOKIE_CONFIG,
      maxAge: MAX_AGE_ACCESS_TOKEN
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      ...COOKIE_CONFIG,
      maxAge: MAX_AGE_REFRESH_TOKEN
    });

    return { message: 'Login successful' };
  }

  @UseGuards(AuthTokenGuard)
  @Post('logout')
  @ApiOperation({ summary: 'Выход пользователя' })
  logout(@Res({ passthrough: true }) res, @Req() req) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return this.authService.logout(req.user.id);
  }
}
