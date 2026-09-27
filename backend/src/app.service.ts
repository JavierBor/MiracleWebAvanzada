import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  async getHello(): Promise<string> {
    const userCount = await this.prisma.usuario.count();
    return `Conexión exitosa con PostgreSQL via Prisma! Usuarios registrados: ${userCount}`;
  }
}