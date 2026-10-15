import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface DatosVocabulario {
  palabra: string;
  fonetica: string | null;
  audio_url: string | null;
  categoria_gramatical: string;
  definicion: string;
  definicion_en?: string | null;
  ejemplo?: string | null;
  sinonimos?: string[];
}

@Injectable()
export class VocabularioService {
  private readonly logger = new Logger(VocabularioService.name);

  private get pythonUrl(): string {
    return process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
  }

  constructor(private readonly prisma: PrismaService) {}

  // 1. Consulta con estrategia de Caché/Persistencia en PostgreSQL
  async consultarPalabra(palabra: string): Promise<DatosVocabulario> {
    const termino = palabra.trim().toLowerCase();

    // A. Buscar primero en la base de datos local (PostgreSQL vía Prisma)
    const existente = await this.prisma.vocabulario.findUnique({
      where: { palabra: termino },
    });

    if (existente) {
      this.logger.log(`[Cache Hit] Palabra '${termino}' recuperada desde PostgreSQL.`);
      return {
        palabra: existente.palabra,
        fonetica: existente.fonetica,
        audio_url: existente.audio_url,
        categoria_gramatical: existente.categoria_gramatical,
        definicion: existente.definicion,
        definicion_en: existente.definicion_en,
        sinonimos: [],
      };
    }

    // B. Si no está en BD (Cache Miss), consultar al microservicio FastAPI
    this.logger.log(`[Cache Miss] Consultando microservicio FastAPI para: ${termino}`);
    const url = `${this.pythonUrl}/api/vocabulario/${encodeURIComponent(termino)}`;

    let datosExternos: DatosVocabulario;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });

      if (response.status === 404) {
        throw new HttpException(
          `La palabra '${palabra}' no existe en la fuente externa`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!response.ok) {
        throw new HttpException(
          'Error en la respuesta del microservicio',
          HttpStatus.BAD_GATEWAY,
        );
      }

      datosExternos = (await response.json()) as DatosVocabulario;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        `El microservicio de procesamiento no está disponible (${error.message})`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // C. Persistir la información limpia en PostgreSQL para futuras consultas
    try {
      await this.prisma.vocabulario.create({
        data: {
          palabra: datosExternos.palabra.toLowerCase(),
          fonetica: datosExternos.fonetica,
          audio_url: datosExternos.audio_url,
          categoria_gramatical: datosExternos.categoria_gramatical,
          definicion: datosExternos.definicion,
          definicion_en: (datosExternos as any).definicion_en || null,
          fuente: 'Datamuse API + MyMemory Translator',
        },
      });
      this.logger.log(`[Persistencia] Palabra '${termino}' guardada con éxito en PostgreSQL.`);
    } catch (dbError: any) {
      this.logger.warn(`No se pudo persistir '${termino}' en BD: ${dbError.message}`);
    }

    return datosExternos;
  }

  // 2. Generación dinámica del desafío del juego
  async generarDesafioJuego(palabraClave: string) {
    const vocabulario = await this.consultarPalabra(palabraClave);

    const distractoras = ['computer', 'classroom', 'university', 'journey'];
    const opciones = Array.from(new Set([vocabulario.palabra, ...distractoras]))
      .sort(() => Math.random() - 0.5);

    return {
      tipo: 'LISTENING_AND_DEFINITION',
      pista_audio: vocabulario.audio_url,
      pista_fonetica: vocabulario.fonetica,
      categoria: vocabulario.categoria_gramatical,
      definicion: vocabulario.definicion,
      definicion_en: (vocabulario as any).definicion_en || null,
      opciones: opciones,
      palabra_correcta: vocabulario.palabra,
    };
  }
}