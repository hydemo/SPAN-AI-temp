import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  Logger,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    Logger.log(request.originalUrl);
    Logger.log(request.params);
    Logger.log(request.query);
    Logger.log(request.body);

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => Logger.log(`Complete... ${Date.now() - now}ms`)));
  }
}
