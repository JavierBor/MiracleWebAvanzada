import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../auth/guards/roles.guard.js';

@Controller('api/admin/usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async obtenerUsuarios() {
    return await this.adminService.listarUsuarios();
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string,
  ) {
    return await this.adminService.cambiarEstadoUsuario(id, estado);
  }
}