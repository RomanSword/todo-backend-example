import { SetMetadata } from '@nestjs/common';

export const OnlyForAdmin = () => SetMetadata('onlyForAdmin', true);
