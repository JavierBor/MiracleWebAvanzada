import { Injectable, OnModuleInit, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from './prisma/prisma.service.js';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    try {
      const adminEmail = 'admin@miracle.com';
      const adminPassword = 'admin123';

      // Verificar si el admin ya existe en la base de datos
      const existingAdmin = await this.prisma.usuario.findUnique({
        where: { correo: adminEmail },
      });

      if (!existingAdmin) {
        // Generar el hash seguro con bcryptjs
        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Crear el usuario administrador por defecto
        await this.prisma.usuario.create({
          data: {
            correo: adminEmail,
            contrasena_hash: hashedPassword,
            rol: 'ADMIN',
            estado: 'ACTIVO',
          },
        });

        console.log('✅ [Seed Automático] Cuenta de administrador creada por defecto exitosamente.');
      }
    } catch (error) {
      console.error(
        '⚠️ [Seed Automático] Error al verificar/crear el admin:',
        (error as Error).message,
      );
    }
  }

  async getHello(): Promise<string> {
    const userCount = await this.prisma.usuario.count();
    return `Conexión exitosa con PostgreSQL via Prisma! Usuarios registrados: ${userCount}`;
  }

  async checkDeepHealth(requestId?: string) {
    const start = Date.now();
    const correlationId = requestId || randomUUID();
    let dbStatus: 'up' | 'down' = 'down';
    let pythonStatus: 'up' | 'down' = 'down';

    // 1. Verificar conectividad real con PostgreSQL (SELECT 1)
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch {
      dbStatus = 'down';
    }

    // 2. Verificar disponibilidad del microservicio Python (FastAPI)
    const pythonUrl = process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    try {
      const res = await fetch(`${pythonUrl}/health`, {
        headers: { 'X-Request-Id': correlationId },
        signal: controller.signal,
      });
      if (res.ok) {
        pythonStatus = 'up';
      }
    } catch {
      pythonStatus = 'down';
    } finally {
      clearTimeout(timeoutId);
    }

    const payload = {
      status: dbStatus === 'up' && pythonStatus === 'up' ? 'ok' : 'degraded',
      service: 'nestjs-backend',
      timestamp: new Date().toISOString(),
      latency_ms: Date.now() - start,
      dependencies: {
        postgresql: dbStatus,
        python_microservice: pythonStatus,
      },
    };

    if (dbStatus !== 'up') {
      throw new ServiceUnavailableException(payload);
    }

    return payload;
  }
}