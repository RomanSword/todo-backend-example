import {
  Request as ExpressRequest,
  Response as ExpressResponse
} from 'express';

import { User } from 'src/users/entities/user.entity';

interface cookieTokens {
  access_token?: string;
  refresh_token?: string;
}

declare global {
  interface Request extends ExpressRequest {
    cookies: cookieTokens;
    user?: User | null;
  }

  interface Response extends ExpressResponse {
    cookies: cookieTokens;
  }

  interface JwtPayload {
    sub: string;
    username: string;
  }
}

export {};
