import { Controller, Get, Param, Query } from '@nestjs/common';
import { VocabularioService } from './vocabulario.service.js';

@Controller('juegos/vocabulario')
export class VocabularioController {
  constructor(private readonly vocabularioService: VocabularioService) {}

  // Endpoint 1: Obtener información cruda validada desde FastAPI
  @Get('info/:palabra')
  async getVocabulario(@Param('palabra') palabra: string) {
    return this.vocabularioService.consultarPalabra(palabra);
  }

  // Endpoint 2: Obtener una ronda interactiva de juego sin repeticiones
  @Get('desafio')
  async getDesafio(
    @Query('palabra') palabra: string = 'challenge',
    @Query('usadas') usadas: string = '' // Nuevo parámetro para la memoria
  ) {
    // Convertimos el string "perro,gato" en un arreglo ['perro', 'gato']
    const palabrasUsadas = usadas ? usadas.split(',').map(p => p.trim().toLowerCase()) : [];
    
    return this.vocabularioService.generarDesafioJuego(palabra, palabrasUsadas);
  }
}