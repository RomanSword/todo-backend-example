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

// Перехватчик, который преобразует данные, выходящие из endpoint'ов на основании DTO в @Serialize
@Injectable()
export class TransformInterceptor<T, R = T> implements NestInterceptor<T, R> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<R> {
    // Получаем DTO-класс, указанный в @Serialize()
    const dto = this.reflector.get<ClassConstructor<R>>(
      '__responseClass',
      context.getHandler()
    );

    return next.handle().pipe(
      map((data: T): R => {
        // Если DTO не задан или данных нет — возвращаем как есть
        if (!dto || data === null || data === undefined)
          return data as unknown as R;

        // Преобразуем либо объект, либо массив
        return plainToInstance(dto, data, {
          excludeExtraneousValues: true, // использовать только @Expose поля
          enableImplicitConversion: true // приведение типов
        });
      })
    );
  }
}
