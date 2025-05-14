import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf
} from 'class-validator';

import { FormUserDto } from './form-user.dto';

const MIN_PASSWORD_LENGTH = 8;

export class UpdateUserDto extends FormUserDto {
  @ValidateIf((userDto) => userDto.oldPassword !== undefined)
  @MinLength(MIN_PASSWORD_LENGTH)
  @IsString()
  @IsNotEmpty({ message: 'password should not be empty' })
  @ApiPropertyOptional({ example: 'qwerty123' })
  password?: string;

  @ValidateIf((userDto) => userDto.password !== undefined)
  @MinLength(MIN_PASSWORD_LENGTH)
  @IsString()
  @IsNotEmpty({ message: 'oldPassword should not be empty' })
  @ApiPropertyOptional({ example: 'qwerty123' })
  oldPassword?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Хеш-код' })
  refreshToken?: string;
}
