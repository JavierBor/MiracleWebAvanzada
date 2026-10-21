import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ForoService } from './foro.service.js';

@Controller('api/foro')
export class ForoController {
  constructor(private readonly foroService: ForoService) {}

  @Get('buscar')
  async buscarForo(@Query('q') query: string) {
    if (!query || query.trim() === '') {
      return { metadatos_busqueda: {}, resultados: [] };
    }
    return this.foroService.buscarPublicacionesInteligente(query);
  }
  
  @Post('crear')
  async crearPublicacion(@Body() body: any) {
    return this.foroService.crearPublicacionDb(body);
  }

  @Get('todas')
  async obtenerTodas() {
    return this.foroService.obtenerTodasLasPublicaciones();
  }
}