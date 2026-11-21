import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkOutline, helpCircleOutline, optionsOutline } from 'ionicons/icons';

import { HeaderComponent } from '../../components/header/header.component';
import {
  AdaptativoService,
  NivelDificultad,
  RespuestaAdaptativa,
} from '../../services/adaptativo.service';

@Component({
  selector: 'app-verb-transformer',
  templateUrl: './verb-transformer.component.html',
  styleUrls: ['./verb-transformer.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, IonContent, IonIcon, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VerbTransformerComponent implements OnInit {
  // Estado de juego y adaptación
  racha = 0;
  mejorRacha = 0;
  puntajeSesion = 0;
  nivelActual: NivelDificultad = 'Normal';

  // Control del usuario (Rúbrica EF: aceptar, modificar o rechazar adaptación)
  modoManual = false;
  dificultadManual: NivelDificultad = 'Normal';

  // Datos recibidos desde FastAPI -> NestJS
  desafioActual: RespuestaAdaptativa | null = null;
  verbosUsados: string[] = [];
  mostrarPista = false;
  cargando = false;

  respuestaUsuario = '';
  feedbackMensaje = '';
  feedbackTipo: 'correcto' | 'error' | '' = '';

  constructor(
    private readonly adaptativoService: AdaptativoService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
  ) {
    addIcons({ checkmarkOutline, helpCircleOutline, optionsOutline });
  }

  ngOnInit(): void {
    // Cargar mejor racha histórica desde PostgreSQL
    this.adaptativoService.obtenerResumen('Verb Transformer').subscribe({
      next: (res) => {
        this.mejorRacha = res.mejorRacha;
        this.cdr.detectChanges();
      },
      error: () => {
        const guardada = localStorage.getItem('miracle_best_streak_verbs');
        if (guardada) this.mejorRacha = parseInt(guardada, 10);
      },
    });

    this.pedirSiguienteVerbo();
  }

  pedirSiguienteVerbo(ultimoResultado?: boolean): void {
    this.cargando = true;
    this.mostrarPista = false;
    this.cdr.detectChanges();

    this.adaptativoService
      .obtenerSiguienteVerbo({
        rachaActual: this.racha,
        ultimoResultado,
        verbosUsados: this.verbosUsados,
        modoManual: this.modoManual,
        dificultadFija: this.modoManual ? this.dificultadManual : undefined,
      })
      .subscribe({
        next: (data) => {
          this.desafioActual = data;
          this.nivelActual = data.nivel_activo;
          this.respuestaUsuario = '';
          this.cargando = false;

          if (!this.verbosUsados.includes(data.verbo_base)) {
            this.verbosUsados.push(data.verbo_base);
            if (this.verbosUsados.length > 15) this.verbosUsados.shift();
          }

          this.cdr.detectChanges();
        },
        error: () => {
          this.cargando = false;
          this.feedbackTipo = 'error';
          this.feedbackMensaje = 'No se pudo conectar con el servidor para obtener el verbo.';
          this.cdr.detectChanges();
        },
      });
  }

  cambiarModoControl(): void {
    this.pedirSiguienteVerbo();
  }

  cambiarDificultadManual(nivel: NivelDificultad): void {
    this.dificultadManual = nivel;
    if (this.modoManual) {
      this.pedirSiguienteVerbo();
    }
  }

  comprobar(): void {
    const entrada = this.respuestaUsuario.trim().toLowerCase();
    if (!entrada || !this.desafioActual || this.cargando) return;

    const esCorrecto = this.desafioActual.formas_pasado
      .map((f) => f.toLowerCase())
      .includes(entrada);

    if (esCorrecto) {
      this.racha++;
      this.puntajeSesion += this.nivelActual === 'Experto' ? 30 : this.nivelActual === 'Difícil' ? 20 : 10;

      if (this.racha > this.mejorRacha) {
        this.mejorRacha = this.racha;
        localStorage.setItem('miracle_best_streak_verbs', this.mejorRacha.toString());
      }

      this.feedbackTipo = 'correcto';
      this.feedbackMensaje = `¡Correcto! (${this.desafioActual.verbo_base} → ${entrada})`;

      // Persistir avance en PostgreSQL al subir de tramo o cada 5 aciertos
      if (this.racha === 5 || this.racha === 10 || this.racha % 5 === 0) {
        this.guardarProgresoBd();
      }

      this.pedirSiguienteVerbo(true);
    } else {
      const verboFallado = this.desafioActual.verbo_base;
      const correcta = this.desafioActual.formas_pasado[0].toUpperCase();
      const rachaAlcanzada = this.racha;

      // Persistir la partida y el error cometido en PostgreSQL
      this.guardarProgresoBd({
        verboFallado,
        respuestaUsuario: entrada,
        respuestaEsperada: correcta,
        nivelAlFallar: this.nivelActual,
      });

      this.racha = 0;
      this.puntajeSesion = 0;
      this.feedbackTipo = 'error';
      this.feedbackMensaje = `Incorrecto. El pasado de ${verboFallado} es "${correcta}". (Racha previa: ${rachaAlcanzada})`;

      this.pedirSiguienteVerbo(false);
    }

    setTimeout(() => {
      this.feedbackMensaje = '';
      this.feedbackTipo = '';
      this.cdr.detectChanges();
    }, 3200);
  }

  private guardarProgresoBd(errorDetalle?: Record<string, any>): void {
    this.adaptativoService
      .registrarInteraccion({
        nivelJuego: 'ING_II',
        nombreJuego: 'Verb Transformer',
        categoria: 'VERBOS',
        puntaje: this.puntajeSesion,
        rachaMaxima: this.racha,
        modoAdaptativo: !this.modoManual,
        erroresComunes: errorDetalle,
      })
      .subscribe({
        next: (res) => {
          if (res?.resumen?.mejorRacha > this.mejorRacha) {
            this.mejorRacha = res.resumen.mejorRacha;
          }
        },
      });
  }
}