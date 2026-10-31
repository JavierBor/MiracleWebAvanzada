import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.js'; // Importación del environment dinámico

export interface DesafioJuego {
  tipo: string;
  pista_audio: string | null;
  pista_fonetica: string | null;
  categoria: string;
  definicion: string;
  definicion_en: string | null;
  opciones: string[];
  palabra_correcta: string;
}

@Injectable({
  providedIn: 'root'
})
export class VocabularioService {
  // Se concatena la URL base según el entorno activo (local o producción)
  private readonly apiUrl = `${environment.apiUrl}/juegos/vocabulario`;

  constructor(private readonly http: HttpClient) {}

  obtenerDesafio(palabra: string, usadas: string[] = []): Observable<DesafioJuego> {
    // Si hay palabras usadas, las unimos con comas, si no, lo dejamos vacío
    const queryUsadas = usadas.length > 0 ? `&usadas=${usadas.join(',')}` : '';

    // Adjuntamos el parámetro a la URL
    return this.http.get<DesafioJuego>(`${this.apiUrl}/desafio?palabra=${palabra}${queryUsadas}`);
  }
}