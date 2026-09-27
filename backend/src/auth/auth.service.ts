import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto, LoginDto } from './auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existeUsuario = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });

    if (existeUsuario) {
      throw new BadRequestException('El correo ya se encuentra registrado');
    }

    const contrasena_hash = await bcrypt.hash(dto.contrasena, 10);

    const nuevoUsuario = await this.prisma.usuario.create({
      data: {
        correo: dto.correo,
        contrasena_hash,
      },
    });

    const payload = {
      sub: nuevoUsuario.id,
      correo: nuevoUsuario.correo,
      rol: nuevoUsuario.rol,
    };

    return {
      mensaje: 'Usuario registrado exitosamente',
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        id: nuevoUsuario.id,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
        estado: nuevoUsuario.estado,
      },
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    if (usuario.estado === 'RESTRINGIDO') {
      throw new ForbiddenException('Tu cuenta se encuentra restringida');
    }

    const passwordValida = await bcrypt.compare(
      dto.contrasena,
      usuario.contrasena_hash,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    return {
      mensaje: 'Inicio de sesión exitoso',
      access_token: await this.jwtService.signAsync(payload),
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
        estado: usuario.estado,
      },
    };
  }
}