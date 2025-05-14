import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl
} from 'class-validator';

export class FormUserDto {
  @ApiProperty({ example: 'ivan.ivanov' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'Иван' })
  @IsNotEmpty()
  @IsString()
  firstname: string;

  @ApiProperty({ example: 'Иванов' })
  @IsNotEmpty()
  @IsString()
  lastname: string;

  @ApiProperty({ example: 'ivanov@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'https://ya.ru' })
  @IsOptional()
  @IsUrl()
  avatarLink?: string;

  @ApiProperty({ example: 'https://ya.ru' })
  @IsOptional()
  @IsUrl()
  resumeLink?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isAdmin?: boolean;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isMentor?: boolean;
}
