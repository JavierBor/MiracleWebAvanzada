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
    // A. Buscar primero en la base de datos local (PostgreSQL vía Prisma)
    const existente = await this.prisma.vocabulario.findUnique({
      where: { palabra: termino },
    });

    if (existente) {
      // Calculamos cuántos días han pasado desde la última actualización
      const diasDesdeActualizacion = (new Date().getTime() - existente.ultima_actualizacion.getTime()) / (1000 * 3600 * 24);
      
      if (diasDesdeActualizacion < 30) {
        this.logger.log(`[Cache Hit] Palabra '${termino}' recuperada (Fresca: hace ${Math.round(diasDesdeActualizacion)} días).`);
        return {
          palabra: existente.palabra,
          fonetica: existente.fonetica,
          audio_url: existente.audio_url,
          categoria_gramatical: existente.categoria_gramatical,
          definicion: existente.definicion,
          definicion_en: existente.definicion_en,
          sinonimos: [],
        };
      } else {
        this.logger.log(`[Cache Stale] Palabra '${termino}' obsoleta (> 30 días). Refrescando desde API...`);
        // No retornamos nada, dejamos que el código siga hacia abajo para consultar a la API
      }
    }

    // B. Si no está en BD (Cache Miss), consultar al microservicio FastAPI
    this.logger.log(`[Cache Miss] Consultando microservicio FastAPI para: ${termino}`);
    const url = `${this.pythonUrl}/api/vocabulario/${encodeURIComponent(termino)}`;

    let datosExternos: DatosVocabulario;

    // --- MANEJO DE INDISPONIBILIDAD: Timeout de 5 segundos ---
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); 

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal, // Vinculamos el abortador a la petición
      });

      clearTimeout(timeoutId); // Si responde a tiempo, limpiamos el temporizador

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
      clearTimeout(timeoutId);
      
      // Si el error es por timeout, lanzamos un 504 Gateway Timeout
      if (error.name === 'AbortError') {
        throw new HttpException(
          `El servicio Python tardó demasiado en responder (Timeout excedido)`,
          HttpStatus.GATEWAY_TIMEOUT,
        );
      }
      if (error instanceof HttpException) throw error;
      
      throw new HttpException(
        `El microservicio de procesamiento no está disponible (${error.message})`,
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // --- VALIDACIÓN DE LOS DATOS RECUPERADOS ---
    // Evitamos guardar registros corruptos si la API devuelve algo incompleto
    if (!datosExternos || !datosExternos.palabra || !datosExternos.definicion) {
      throw new HttpException(
        'Los datos recibidos desde la fuente externa están incompletos o corruptos.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // --- LIMPIEZA Y NORMALIZACIÓN ---
    // Nos aseguramos de quitar espacios en blanco al inicio y final, y estandarizar
    const palabraLimpia = datosExternos.palabra.trim().toLowerCase();
    const definicionLimpia = datosExternos.definicion.trim();
    const foneticaLimpia = datosExternos.fonetica ? datosExternos.fonetica.trim() : null;
    const audioLimpio = datosExternos.audio_url ? datosExternos.audio_url.trim() : null;
    const categoriaLimpia = datosExternos.categoria_gramatical ? datosExternos.categoria_gramatical.trim() : 'unknown';
    const definicionEnLimpia = (datosExternos as any).definicion_en ? (datosExternos as any).definicion_en.trim() : null;

    // C. Persistir la información limpia en PostgreSQL para futuras consultas
// C. Persistir o Actualizar la información limpia en PostgreSQL
    try {
      await this.prisma.vocabulario.upsert({
        where: { palabra: palabraLimpia },
        update: {
          fonetica: foneticaLimpia,
          audio_url: audioLimpio,
          categoria_gramatical: categoriaLimpia,
          definicion: definicionLimpia,
          definicion_en: definicionEnLimpia,
          fecha_recuperacion: new Date(), // Actualizamos la fecha de trazabilidad
        },
        create: {
          palabra: palabraLimpia,
          fonetica: foneticaLimpia,
          audio_url: audioLimpio,
          categoria_gramatical: categoriaLimpia,
          definicion: definicionLimpia,
          definicion_en: definicionEnLimpia,
          fuente: 'Datamuse API + MyMemory Translator',
        },
      });
      this.logger.log(`[Persistencia] Palabra '${palabraLimpia}' guardada/actualizada en PostgreSQL.`);
    } catch (dbError: any) {
      this.logger.warn(`No se pudo persistir '${palabraLimpia}' en BD: ${dbError.message}`);
    }

    // Actualizamos el objeto antes de enviarlo al frontend para devolver los datos procesados
    datosExternos.palabra = palabraLimpia;
    datosExternos.definicion = definicionLimpia;
    datosExternos.fonetica = foneticaLimpia;
    datosExternos.audio_url = audioLimpio;
    datosExternos.categoria_gramatical = categoriaLimpia;
    (datosExternos as any).definicion_en = definicionEnLimpia;

    return datosExternos;
  }

  // 2. Generación dinámica del desafío del juego (A prueba de duplicados)
  async generarDesafioJuego(palabraClave: string, palabrasUsadas: string[] = []) {
    // 1. Obtener la palabra solicitada inicialmente
    let vocabulario = await this.consultarPalabra(palabraClave);

    // 2. Filtro Anti-Repetición: Verificar si la palabra o su definición ya salieron
    if (palabrasUsadas.length > 0) {
      // Buscamos en PostgreSQL las definiciones de las palabras que el usuario ya jugó
      const vocabularioUsado = await this.prisma.vocabulario.findMany({
        where: { palabra: { in: palabrasUsadas } },
        select: { palabra: true, definicion: true }
      });

      const definicionesUsadas = vocabularioUsado.map(v => v.definicion);

      // Si la palabra actual ya se jugó, o su definición es idéntica a una ya vista
      if (palabrasUsadas.includes(vocabulario.palabra) || definicionesUsadas.includes(vocabulario.definicion)) {
        this.logger.log(`Choque detectado: '${vocabulario.palabra}' o su definición ya se usó. Buscando alternativa...`);
        
        // Buscar una palabra aleatoria en la BD que NO esté en la lista y NO tenga la misma definición
        const alternativas = await this.prisma.vocabulario.findMany({
          where: {
            palabra: { notIn: palabrasUsadas },
            definicion: { notIn: definicionesUsadas }
          }
        });

        if (alternativas.length > 0) {
          // Elegir una alternativa al azar de la base local
          const randomIndex = Math.floor(Math.random() * alternativas.length);
          vocabulario = alternativas[randomIndex];
          this.logger.log(`Alternativa seleccionada: '${vocabulario.palabra}'`);
        }
      }
    }

   // Pool de distractores nivel A1 (Inglés I)
    const poolDistractores = [
      'student', 'teacher', 'book', 'pen', 'desk', 'school', 'university', 
      'family', 'brother', 'sister', 'mother', 'father', 'friend', 'person',
      'house', 'room', 'door', 'window', 'table', 'chair', 'car', 'city',
      'water', 'food', 'apple', 'bread', 'coffee', 'dog', 'cat', 'color'
    ];
    
    // Sacamos la palabra correcta para no repetirla en las opciones falsas
    const distractoresDisponibles = poolDistractores.filter(p => p !== vocabulario.palabra);
    
    // Elegimos 3 al azar
    const distractoras = distractoresDisponibles
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    // Mezclamos la palabra correcta con los 3 distractores
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