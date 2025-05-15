import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    const ip = req.ip;

    res.on('finish', async () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const accessToken = req.cookies?.access_token;

      let message = `${method} ${originalUrl} ${statusCode}`;

      if (accessToken) {
        const payload = await this.jwtService.verifyAsync(accessToken, {
          secret: process.env.JWT_ACCESS_SECRET
        });

        message = `${message} USER: ${payload.sub}`;
      }

      message = `${message} IP: ${ip} CONTENT_LENGTH: ${contentLength || 0} USER_AGENT: ${userAgent}`;

      this.logger.log(message);
    });

    next();
  }
}
