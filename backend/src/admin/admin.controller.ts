import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service.js';

@Controller('api/admin/usuarios')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  async obtenerUsuarios() {
    return await this.adminService.listarUsuarios();
  }

  @Patch(':id/estado')
  async cambiarEstado(
    @Param('id') id: string,
    @Body('estado') estado: string
  ) {
    return await this.adminService.cambiarEstadoUsuario(id, estado);
  }
}