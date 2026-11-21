import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { AdaptativoService } from './adaptativo.service.js';
import { RegistrarInteraccionDto, SiguienteVerboDto } from './adaptativo.dto.js';

@ApiTags('Juegos Adaptativos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('juegos')
export class AdaptativoController {
  constructor(private readonly adaptativoService: AdaptativoService) {}

  @Post('adaptativo/siguiente')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtiene el siguiente verbo ajustado por el motor DDA' })
  async siguienteVerbo(@Body() dto: SiguienteVerboDto) {
    return this.adaptativoService.obtenerSiguienteVerbo(dto);
  }

  @Post('interaccion')
  @ApiOperation({ summary: 'Persiste el puntaje, racha y errores del estudiante en PostgreSQL' })
  async guardarInteraccion(@Req() req: any, @Body() dto: RegistrarInteraccionDto) {
    return this.adaptativoService.registrarInteraccion(req.user.sub, dto);
  }

  @Get('interaccion/resumen')
  @ApiOperation({ summary: 'Obtiene el historial y mejor racha del estudiante autenticado' })
  async obtenerResumen(@Req() req: any, @Query('juego') juego?: string) {
    return this.adaptativoService.obtenerResumenEstudiante(req.user.sub, juego);
  }
}