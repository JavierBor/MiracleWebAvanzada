import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private readonly apiUrl = 'http://localhost:3000/juegos/vocabulario';

  constructor(private readonly http: HttpClient) {}

  obtenerDesafio(palabra: string = 'student'): Observable<DesafioJuego> {
    return this.http.get<DesafioJuego>(`${this.apiUrl}/desafio?palabra=${encodeURIComponent(palabra)}`);
  }
}