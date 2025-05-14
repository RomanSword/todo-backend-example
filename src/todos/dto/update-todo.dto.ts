import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateTodoDto {
  @ApiProperty({ example: 'Купить хлеб' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'И батон тоже' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  isDone?: boolean;
}
