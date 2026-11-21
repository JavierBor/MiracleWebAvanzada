import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export type NivelDificultad = 'Normal' | 'Difícil' | 'Experto';

export interface SiguienteVerboPayload {
  rachaActual: number;
  ultimoResultado?: boolean;
  verbosUsados?: string[];
  modoManual?: boolean;
  dificultadFija?: NivelDificultad;
}

export interface RespuestaAdaptativa {
  verbo_base: string;
  formas_pasado: string[];
  nivel_activo: NivelDificultad;
  es_adaptativo: boolean;
  explicacion_adaptacion: string;
  pista_espanol: string | null;
  fonetica: string | null;
  fuente: string;
  degradado?: boolean;
}

export interface RegistrarInteraccionPayload {
  nivelJuego: 'ING_I' | 'ING_II' | 'ING_III' | 'ING_IV';
  nombreJuego: string;
  categoria?: string;
  puntaje: number;
  rachaMaxima?: number;
  modoAdaptativo?: boolean;
  erroresComunes?: Record<string, any>;
}

export interface ResumenEstudiante {
  totalPartidas: number;
  puntajeTotal: number;
  mejorRacha: number;
}

@Injectable({
  providedIn: 'root',
})
export class AdaptativoService {
  private readonly apiUrl = `${environment.apiUrl}/juegos`;

  constructor(private readonly http: HttpClient) {}

  obtenerSiguienteVerbo(payload: SiguienteVerboPayload): Observable<RespuestaAdaptativa> {
    return this.http.post<RespuestaAdaptativa>(`${this.apiUrl}/adaptativo/siguiente`, payload);
  }

  registrarInteraccion(payload: RegistrarInteraccionPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/interaccion`, payload);
  }

  obtenerResumen(juego = 'Verb Transformer'): Observable<ResumenEstudiante> {
    return this.http.get<ResumenEstudiante>(`${this.apiUrl}/interaccion/resumen`, {
      params: { juego },
    });
  }
}