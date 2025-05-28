import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

const NOT_UNIQUE_ERROR_SQL_CONSTRAINT = '23505';
const FOREIGN_KEY_VIOLATION = '23503';
const NOT_NULL_VIOLATION = '23502';

export function handleTypeOrmError(error: unknown) {
  if (error instanceof QueryFailedError) {
    const pgError = error as QueryFailedError & {
      code: string;
      detail?: string;
    };

    switch (pgError.code) {
      case NOT_UNIQUE_ERROR_SQL_CONSTRAINT:
        throw new ConflictException('Duplicate key: ' + pgError.detail);
      case FOREIGN_KEY_VIOLATION:
        throw new BadRequestException(
          'Foreign key constraint violated: ' + pgError.detail
        );
      case NOT_NULL_VIOLATION:
        throw new BadRequestException(
          'Missing required field: ' + pgError.detail
        );
      default:
        throw new InternalServerErrorException(
          'Database error: ' + pgError.message
        );
    }
  }

  // fallback for unknown errors
  throw new InternalServerErrorException('Unexpected error');
}
