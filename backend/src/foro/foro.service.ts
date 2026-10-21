import { Injectable, GatewayTimeoutException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service.js'; // Ajusta la ruta si es necesario
import { firstValueFrom, catchError, timeout } from 'rxjs';

@Injectable()
export class ForoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async buscarPublicacionesInteligente(query: string) {
    // 1. Obtener el corpus desde PostgreSQL (ajusta 'publicacionForo' al nombre real de tu tabla en Prisma)
    const publicaciones = await this.prisma.publicacionForo.findMany({
      select: { id: true, contenido: true }
    });

    // 2. Darle el formato que espera FastAPI (models.py)
    const documents = publicaciones.map(pub => ({
      id: pub.id,
      content: pub.contenido
    }));

    // 3. Obtener la URL de Python (definida en tu docker-compose)
    const pythonUrl = process.env.PYTHON_SERVICE_URL || 'http://python-service:8000';

    try {
      // 4. Mecanismo de consulta con Timeout exigido por la rúbrica (5 segundos)
      const response = await firstValueFrom(
        this.httpService.post(`${pythonUrl}/api/foro/buscar`, { query, documents }).pipe(
          timeout(5000), 
          catchError((error) => {
            throw new GatewayTimeoutException('El motor de búsqueda (Python) no responde a tiempo.');
          })
        )
      );

      const searchResult = response.data;

      // 5. Cruzar resultados de Python con los datos reales de la BD
      const resultadosEnriquecidos = searchResult.results.map((resultadoPython: any) => {
        const pubOriginal = publicaciones.find((p: any) => p.id === resultadoPython.id);
        return {
          ...pubOriginal,
          score_relevancia: resultadoPython.score
        };
      });

      // 6. Retornar resultados listos para Angular con los metadatos exigidos
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
    // Según tu schema.prisma actual, la tabla PublicacionForo requiere al menos un usuarioId y el contenido.
    // Concatenamos el título y el contenido para que Python tenga todo el texto enriquecido para buscar.
    const contenidoCompleto = `[${datos.curso}] ${datos.titulo} - ${datos.contenido}`;

    return await this.prisma.publicacionForo.create({
      data: {
        contenido: contenidoCompleto,
        estado: 'ACTIVA',
        usuarioId: 'c64a3e1d-5fbb-4a61-bf31-5926493ee564' 
      }
    });
  }

  async obtenerTodasLasPublicaciones() {
    return await this.prisma.publicacionForo.findMany({
      orderBy: { fecha_creacion: 'desc' }
    });
  }
}