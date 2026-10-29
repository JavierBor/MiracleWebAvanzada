import { Injectable, OnModuleInit } from '@nestjs/common';
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
    }  catch (error) {
      console.error('⚠️ [Seed Automático] Error al verificar/crear el admin:', (error as Error).message);
    }
  }

  async getHello(): Promise<string> {
    const userCount = await this.prisma.usuario.count();
    return `Conexión exitosa con PostgreSQL via Prisma! Usuarios registrados: ${userCount}`;
  }
}