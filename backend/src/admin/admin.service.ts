import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoUsuario } from '@prisma/client'; // <-- Importamos el Enum oficial de Prisma

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Listar todos los usuarios registrados (excluyendo la contraseña por seguridad)
  async listarUsuarios() {
    return await this.prisma.usuario.findMany({
      select: {
        id: true,
        correo: true,
        rol: true,
        estado: true
      },
      orderBy: {
        id: 'desc'
      }
    });
  }

  // 2. Cambiar el estado de un usuario (ACTIVO <-> RESTRINGIDO)
  async cambiarEstadoUsuario(usuarioId: string, nuevoEstado: string) {
    if (!['ACTIVO', 'RESTRINGIDO'].includes(nuevoEstado)) {
      throw new BadRequestException('El estado enviado no es válido');
    }

    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { id: usuarioId }
    });

    if (!usuarioExistente) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return await this.prisma.usuario.update({
      where: { id: usuarioId },
      data: { estado: nuevoEstado as EstadoUsuario }, // <-- Casteo al Enum correspondiente
      select: {
        id: true,
        correo: true,
        rol: true,
        estado: true
      }
    });
  }
}