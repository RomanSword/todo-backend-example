import { applyDecorators, SetMetadata, UseInterceptors } from '@nestjs/common';

import { TransformInterceptor } from '../interceptors';

export function Serialize(dto: any) {
  return applyDecorators(
    SetMetadata('__responseClass', dto),
    UseInterceptors(TransformInterceptor)
  );
}
