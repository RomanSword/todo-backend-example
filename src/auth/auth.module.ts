import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MAX_AGE_ACCESS_TOKEN } from './const';
import { AuthTokenGuard } from './guards/auth-token.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'access_secret',
      signOptions: { expiresIn: MAX_AGE_ACCESS_TOKEN }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthTokenGuard],
  exports: [AuthService, AuthTokenGuard, JwtModule]
})
export class AuthModule {}
