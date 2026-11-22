import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface RateBucket {
  count: number;
  resetAt: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly buckets = new Map<string, RateBucket>();
  private readonly windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000);
  private readonly maxRequests = Number(process.env.RATE_LIMIT_MAX ?? 100);

  canActivate(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    // Excluir /health para no bloquear los healthchecks automáticos de Docker/Render
    if (req.path === '/health') {
      return true;
    }

    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    // Límite más estricto en endpoints de autenticación contra fuerza bruta
    const isAuthRoute = req.path.startsWith('/auth/');
    const limit = isAuthRoute ? 15 : this.maxRequests;
    const key = `${isAuthRoute ? 'auth' : 'api'}:${clientIp}`;

    const now = Date.now();
    const current = this.buckets.get(key);

    if (!current || now >= current.resetAt) {
      this.buckets.set(key, { count: 1, resetAt: now + this.windowMs });
      res.setHeader('X-RateLimit-Limit', String(limit));
      res.setHeader('X-RateLimit-Remaining', String(limit - 1));
      return true;
    }

    if (current.count >= limit) {
      const retryAfterSec = Math.ceil((current.resetAt - now) / 1000);
      res.setHeader('Retry-After', String(retryAfterSec));
      res.setHeader('X-RateLimit-Limit', String(limit));
      res.setHeader('X-RateLimit-Remaining', '0');
      throw new HttpException(
        `Demasiadas solicitudes. Intenta nuevamente en ${retryAfterSec} segundos.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count += 1;
    res.setHeader('X-RateLimit-Limit', String(limit));
    res.setHeader('X-RateLimit-Remaining', String(limit - current.count));
    return true;
  }
}
