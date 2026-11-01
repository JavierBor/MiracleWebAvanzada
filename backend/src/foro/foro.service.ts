import { Injectable, GatewayTimeoutException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service.js';
import { firstValueFrom, catchError, timeout } from 'rxjs';

@Injectable()
export class ForoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  private get pythonUrl(): string {
    return process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
  }

  async buscarPublicacionesInteligente(query: string) {
    // 1. Obtener el corpus desde PostgreSQL
    const publicaciones = await this.prisma.publicacionForo.findMany({
      select: { id: true, contenido: true }
    });

    // 2. Darle el formato que espera FastAPI (models.py)
    const documents = publicaciones.map(pub => ({
      id: pub.id,
      content: pub.contenido
    }));

    try {
      // 3. Mecanismo de consulta con Timeout de 5 segundos
      const response = await firstValueFrom(
        this.httpService.post(`${this.pythonUrl}/api/foro/buscar`, { query, documents }).pipe(
          timeout(5000), 
          catchError(() => {
            throw new GatewayTimeoutException('El motor de búsqueda (Python) no responde a tiempo.');
          })
        )
      );

      const searchResult = response.data;

      // 4. Cruzar resultados de Python con los datos reales de la BD
      const resultadosEnriquecidos = searchResult.results.map((resultadoPython: any) => {
        const pubOriginal = publicaciones.find((p: any) => p.id === resultadoPython.id);
        return {
          ...pubOriginal,
          score_relevancia: resultadoPython.score
        };
      });

      // 5. Retornar resultados listos para Angular con metadatos
      return {
        metadatos_busqueda: {
          tiempo_procesamiento_ms: searchResult.processing_time_ms,
          total_encontrados: searchResult.results.length
        },
        resultados: resultadosEnriquecidos
      };

    } catch (error: any) {
      console.error('Error en búsqueda inteligente:', error.message);
      if (error instanceof GatewayTimeoutException) throw error;
      throw new InternalServerErrorException('Error procesando la búsqueda en el foro.');
    }
  }

  async crearPublicacionDb(datos: any) {
    const contenidoCompleto = `[${datos.curso}] ${datos.titulo} - ${datos.contenido}`;

    // 1. Buscar dinámicamente el primer usuario que exista en PostgreSQL (Staging o Local)
    const usuarioExistente = await this.prisma.usuario.findFirst();

    if (!usuarioExistente) {
      throw new InternalServerErrorException(
        'No hay usuarios registrados en la base de datos para vincular la publicación.'
      );
    }

    // 2. Insertar la publicación asignando el usuarioId real
    return await this.prisma.publicacionForo.create({
      data: {
        contenido: contenidoCompleto,
        estado: 'ACTIVA',
        usuarioId: usuarioExistente.id
      }
    });
  }

  async obtenerTodasLasPublicaciones() {
    return await this.prisma.publicacionForo.findMany({
      orderBy: { id: 'desc' }
    });
  }
}