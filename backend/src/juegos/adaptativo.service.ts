import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegistrarInteraccionDto, SiguienteVerboDto } from './adaptativo.dto.js';

export interface RespuestaAdaptativa {
  verbo_base: string;
  formas_pasado: string[];
  nivel_activo: 'Normal' | 'Difícil' | 'Experto';
  es_adaptativo: boolean;
  explicacion_adaptacion: string;
  pista_espanol: string | null;
  fonetica: string | null;
  fuente: string;
  degradado?: boolean;
}

@Injectable()
export class AdaptativoService {
  private readonly logger = new Logger(AdaptativoService.name);

  private get pythonUrl(): string {
    return process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000';
  }

  constructor(private readonly prisma: PrismaService) {}

  async obtenerSiguienteVerbo(dto: SiguienteVerboDto): Promise<RespuestaAdaptativa> {
    const url = `${this.pythonUrl}/api/adaptativo/siguiente-verbo`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          racha_actual: dto.rachaActual,
          ultimo_resultado: dto.ultimoResultado ?? null,
          verbos_usados: dto.verbosUsados ?? [],
          modo_manual: dto.modoManual ?? false,
          dificultad_fija: dto.dificultadFija ?? null,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`FastAPI respondió con HTTP ${response.status}`);
      }

      const data = (await response.json()) as RespuestaAdaptativa;

      // Persistir en caché Vocabulario si trae definición enriquecida desde Datamuse/MyMemory
      if (data.pista_espanol) {
        await this.cachearVerboEnBd(data);
      }

      return { ...data, degradado: false };
    } catch (error: any) {
      clearTimeout(timeoutId);
      this.logger.warn(
        `[Degradación Controlada] FastAPI no disponible (${error.message}). Usando respaldo local en NestJS.`,
      );
      return this.generarFallbackLocal(dto);
    }
  }

  private async cachearVerboEnBd(data: RespuestaAdaptativa): Promise<void> {
    const palabra = data.verbo_base.trim().toLowerCase();
    try {
      await this.prisma.vocabulario.upsert({
        where: { palabra },
        update: {
          fonetica: data.fonetica,
          definicion: data.pista_espanol ?? 'Verbo en inglés',
          fecha_recuperacion: new Date(),
        },
        create: {
          palabra,
          fonetica: data.fonetica,
          categoria_gramatical: 'verbo',
          definicion: data.pista_espanol ?? 'Verbo en inglés',
          fuente: data.fuente,
        },
      });
    } catch (dbError: any) {
      this.logger.warn(`No se pudo cachear el verbo '${palabra}': ${dbError.message}`);
    }
  }

  private generarFallbackLocal(dto: SiguienteVerboDto): RespuestaAdaptativa {
    const fallbackPool = [
      { base: 'PLAY', past: ['played'], level: 'Normal' as const },
      { base: 'WORK', past: ['worked'], level: 'Normal' as const },
      { base: 'GO', past: ['went'], level: 'Difícil' as const },
      { base: 'WRITE', past: ['wrote'], level: 'Difícil' as const },
      { base: 'TEACH', past: ['taught'], level: 'Experto' as const },
      { base: 'UNDERSTAND', past: ['understood'], level: 'Experto' as const },
    ];

    const racha = dto.ultimoResultado === false ? 0 : dto.rachaActual;
    const nivel: 'Normal' | 'Difícil' | 'Experto' =
      dto.modoManual && dto.dificultadFija
        ? dto.dificultadFija
        : racha >= 10
          ? 'Experto'
          : racha >= 5
            ? 'Difícil'
            : 'Normal';

    const filtrados = fallbackPool.filter((v) => v.level === nivel);
    const elegido = filtrados[Math.floor(Math.random() * filtrados.length)];

    return {
      verbo_base: elegido.base,
      formas_pasado: elegido.past,
      nivel_activo: nivel,
      es_adaptativo: !(dto.modoManual && dto.dificultadFija),
      explicacion_adaptacion: `Nivel ${nivel} asignado en modo de respaldo local (servicio adaptativo externo temporalmente no disponible).`,
      pista_espanol: null,
      fonetica: null,
      fuente: 'NestJS Fallback Local',
      degradado: true,
    };
  }

  async registrarInteraccion(usuarioId: string, dto: RegistrarInteraccionDto) {
    // Buscar o crear el catálogo del juego en PostgreSQL para mantener integridad referencial
    let juego = await this.prisma.juego.findFirst({
      where: {
        nivel: dto.nivelJuego,
        nombre: dto.nombreJuego,
      },
    });

    if (!juego) {
      juego = await this.prisma.juego.create({
        data: {
          nivel: dto.nivelJuego,
          nombre: dto.nombreJuego,
          categoria: dto.categoria ?? 'GENERAL',
        },
      });
    }

    const interaccion = await this.prisma.interaccionEstudiante.create({
      data: {
        usuarioId,
        juegoId: juego.id,
        puntaje: dto.puntaje,
        errores_comunes: {
          racha_maxima: dto.rachaMaxima ?? 0,
          modo_adaptativo: dto.modoAdaptativo ?? true,
          ...(dto.erroresComunes ?? {}),
        },
      },
    });

    const resumen = await this.obtenerResumenEstudiante(usuarioId, dto.nombreJuego);

    return {
      mensaje: 'Interacción registrada en PostgreSQL',
      interaccionId: interaccion.id,
      resumen,
    };
  }

  async obtenerResumenEstudiante(usuarioId: string, nombreJuego?: string) {
    const interacciones = await this.prisma.interaccionEstudiante.findMany({
      where: {
        usuarioId,
        ...(nombreJuego ? { juego: { nombre: nombreJuego } } : {}),
      },
      orderBy: { fecha: 'desc' },
    });

    let mejorRacha = 0;
    let puntajeTotal = 0;

    for (const item of interacciones) {
      puntajeTotal += item.puntaje;
      const meta = item.errores_comunes as Record<string, any> | null;
      if (meta && typeof meta.racha_maxima === 'number' && meta.racha_maxima > mejorRacha) {
        mejorRacha = meta.racha_maxima;
      }
    }

    return {
      totalPartidas: interacciones.length,
      puntajeTotal,
      mejorRacha,
    };
  }
}