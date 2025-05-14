import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClassConstructor, plainToInstance } from 'class-transformer';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Получаем DTO-класс, указанный в @Serialize()
    const dto = this.reflector.get<ClassConstructor<any>>(
      '__responseClass',
      context.getHandler()
    );

    return next.handle().pipe(
      map((data) => {
        // Если DTO не задан или данных нет — возвращаем как есть
        if (!dto || data === null || data === undefined) return data;

        // Преобразуем либо объект, либо массив
        return plainToInstance(dto, data, {
          excludeExtraneousValues: true, // использовать только @Expose поля
          enableImplicitConversion: true // приведение типов
        });
      })
    );
  }
}
