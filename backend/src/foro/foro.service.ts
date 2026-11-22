import {
  Injectable,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service.js';
import { firstValueFrom, catchError, timeout } from 'rxjs';
import { CreateForoDto } from './foro.dto.js';

@Injectable()
export class ForoService {
  private readonly logger = new Logger(ForoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  private get pythonUrl(): string {
    return process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
  }

  private get internalApiKey(): string {
    return process.env.INTERNAL_API_KEY || 'miracle_internal_secret_2026';
  }

  async buscarPublicacionesInteligente(query: string, requestId?: string) {
    const correlationId = requestId || randomUUID();

    const publicaciones = await this.prisma.publicacionForo.findMany({
      where: { estado: 'ACTIVA' },
      select: { id: true, contenido: true, fecha_creacion: true },
    });

    const documents = publicaciones.map((pub) => ({
      id: pub.id,
      content: pub.contenido,
    }));

    try {
      const response = await firstValueFrom(
        this.httpService
          .post(
            `${this.pythonUrl}/api/foro/buscar`,
            { query, documents },
            {
              headers: {
                'X-Internal-Api-Key': this.internalApiKey,
                'X-Request-Id': correlationId,
              },
            },
          )
          .pipe(
            timeout(5000),
            catchError(() => {
              throw new GatewayTimeoutException(
                'El motor de búsqueda (Python) no responde a tiempo.',
              );
            }),
          ),
      );

      const searchResult = response.data;

      const resultadosEnriquecidos = searchResult.results.map((resultadoPython: any) => {
        const pubOriginal = publicaciones.find((p: any) => p.id === resultadoPython.id);
        return {
          ...pubOriginal,
          score_relevancia: resultadoPython.score,
        };
      });

      return {
        metadatos_busqueda: {
          tiempo_procesamiento_ms: searchResult.processing_time_ms,
          total_encontrados: searchResult.results.length,
        },
        resultados: resultadosEnriquecidos,
      };
    } catch (error: any) {
      this.logger.error(`[REQ:${correlationId}] Error en búsqueda inteligente: ${error.message}`);
      if (error instanceof GatewayTimeoutException) throw error;
      throw new InternalServerErrorException('Error procesando la búsqueda en el foro.');
    }
  }

  async crearPublicacionDb(usuarioId: string, datos: CreateForoDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: { id: true, estado: true },
    });

    if (!usuario) {
      throw new NotFoundException('El usuario autenticado no existe en la base de datos.');
    }

    const contenidoCompleto = `[${datos.curso.trim()}] ${datos.titulo.trim()} - ${datos.contenido.trim()}`;

    return await this.prisma.publicacionForo.create({
      data: {
        contenido: contenidoCompleto,
        estado: 'ACTIVA',
        usuarioId: usuario.id,
      },
    });
  }

  async obtenerTodasLasPublicaciones() {
    return await this.prisma.publicacionForo.findMany({
      where: { estado: 'ACTIVA' },
      orderBy: { fecha_creacion: 'desc' },
    });
  }
}