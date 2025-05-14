import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'ivan.ivanov' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiPropertyOptional({ example: 'qwerty123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
