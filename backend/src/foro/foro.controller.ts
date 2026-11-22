import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForoService } from './foro.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CreateForoDto } from './foro.dto.js';

@ApiTags('Foro Comunitario')
@Controller('api/foro')
export class ForoController {
  constructor(private readonly foroService: ForoService) {}

  @Get('buscar')
  @ApiOperation({ summary: 'Busca publicaciones por similitud semántica (TF-IDF en Python)' })
  async buscarForo(@Query('q') query: string) {
    if (!query || query.trim() === '') {
      return { metadatos_busqueda: {}, resultados: [] };
    }
    return this.foroService.buscarPublicacionesInteligente(query);
  }

  @Post('crear')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crea una nueva publicación vinculada al usuario autenticado' })
  async crearPublicacion(@Req() req: any, @Body() dto: CreateForoDto) {
    return this.foroService.crearPublicacionDb(req.user.sub, dto);
  }

  @Get('todas')
  @ApiOperation({ summary: 'Lista todas las publicaciones activas del foro' })
  async obtenerTodas() {
    return this.foroService.obtenerTodasLasPublicaciones();
  }
}
