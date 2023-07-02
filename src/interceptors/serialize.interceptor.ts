import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common'
import { plainToInstance, ClassConstructor } from 'class-transformer'
import { map, Observable } from 'rxjs'

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private readonly dto: ClassConstructor<T>) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<T | T[]> {
    return next
      .handle()
      .pipe(
        map((data) =>
          plainToInstance(this.dto, data, { excludeExtraneousValues: true }),
        ),
      )
  }
}
