import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'ivan.ivanov' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'ivan@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'qwerty123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Новый пароль должен быть минимум 8 символов' })
  password: string;
}
