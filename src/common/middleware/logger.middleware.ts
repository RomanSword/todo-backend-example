import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const accessToken = req.cookies?.access_token;

      if (accessToken) {
        this.jwtService
          .verifyAsync<JwtPayload>(accessToken, {
            secret: process.env.JWT_ACCESS_SECRET
          })
          .then((payload) => {
            let message = `${method} ${originalUrl} ${statusCode}`;

            message = `${message} IP: ${ip} CONTENT_LENGTH: ${contentLength || 0} USER_AGENT: ${userAgent}`;
            message = `${message} USER: ${payload.sub}`;

            this.logger.log(message);
          })
          .catch((error) => {
            this.logger.log('While loggin something went wrong: ', error);
          });
      }
    });

    next();
  }
}
