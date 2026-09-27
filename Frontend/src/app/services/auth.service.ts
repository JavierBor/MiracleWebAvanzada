import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

export interface AuthResponse {
  mensaje: string;
  access_token: string;
  usuario: {
    id: string;
    correo: string;
    rol: string;
    estado: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';

  constructor(private readonly http: HttpClient) {}

  register(datos: { correo: string; contrasena: string }) {
    return this.http.post(`${this.apiUrl}/register`, datos).pipe(
      tap((res: any) => this.guardarSesion(res))
    );
  }

  login(datos: { correo: string; contrasena: string }) {
    return this.http.post(`${this.apiUrl}/login`, datos).pipe(
      tap((res: any) => this.guardarSesion(res))
    );
  }

  private guardarSesion(res: AuthResponse): void {
    localStorage.setItem('miracle_token', res.access_token);
    localStorage.setItem('miracle_user', JSON.stringify(res.usuario));
  }

  obtenerUsuarioActual() {
    const userStr = localStorage.getItem('miracle_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('miracle_token');
    localStorage.removeItem('miracle_user');
  }
}