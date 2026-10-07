import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface DatosVocabulario {
  palabra: string;
  fonetica: string | null;
  audio_url: string | null;
  categoria_gramatical: string;
  definicion: string;
  ejemplo: string | null;
  sinonimos: string[];
}

@Injectable()
export class VocabularioService {
  private pythonUrl = process.env.PYTHON_SERVICE_URL || 'http://localhost:8000';

  constructor(private readonly prisma: PrismaService) {}

  // 1. Consulta al microservicio FastAPI
  async consultarPalabra(palabra: string): Promise<DatosVocabulario> {
    try {
      const url = `${this.pythonUrl}/api/vocabulario/${encodeURIComponent(palabra.trim().toLowerCase())}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.status === 404) {
        throw new HttpException(`La palabra '${palabra}' no existe en el diccionario`, HttpStatus.NOT_FOUND);
      }

      if (!response.ok) {
        throw new HttpException('Error en la comunicación con el microservicio', HttpStatus.BAD_GATEWAY);
      }

      return (await response.json()) as DatosVocabulario;
    } catch (error: any) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'El microservicio de procesamiento no está disponible temporalmente',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }

  // 2. Lógica del Juego: Generar desafío dinámico
  async generarDesafioJuego(palabraClave: string) {
    const vocabulario = await this.consultarPalabra(palabraClave);

    // Opciones distractoras para alternativa múltiple estilo Kahoot
    const distractoras = ['computer', 'classroom', 'university', 'journey'];
    const opciones = Array.from(new Set([vocabulario.palabra, ...distractoras]))
      .sort(() => Math.random() - 0.5);

    return {
      tipo: 'LISTENING_AND_DEFINITION',
      pista_audio: vocabulario.audio_url,
      pista_fonetica: vocabulario.fonetica,
      categoria: vocabulario.categoria_gramatical,
      definicion_en: vocabulario.definicion,
      opciones: opciones,
      // La respuesta correcta la guardamos o validamos en el backend
      palabra_correcta: vocabulario.palabra,
    };
  }
}