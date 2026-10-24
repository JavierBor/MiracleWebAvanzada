import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { method, url } = req;

    return next.handle().pipe(
      tap(() => {
        const delay = Date.now() - now;
        res.setHeader('X-Response-Time', `${delay}ms`);
        this.logger.log(`${method} ${url} - ${res.statusCode} - ${delay}ms`);
      }),
    );
  }
}