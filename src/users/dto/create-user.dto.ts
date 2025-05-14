import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

import { FormUserDto } from './form-user.dto';

export class CreateUserDto extends FormUserDto {
  @ApiProperty({ example: 'qwerty123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
