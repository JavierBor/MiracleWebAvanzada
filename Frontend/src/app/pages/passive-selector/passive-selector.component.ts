import { Component, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline, timeOutline, reloadOutline, arrowBackOutline, playCircle } from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';

export interface OpcionPasiva {
  texto: string;
  esCorrecta: boolean;
}

export interface PreguntaPasiva {
  id: number;
  oracionActiva: string; // Ej: "The dog ate the pizza 🍕"
  opciones: OpcionPasiva[];
  explicacion: string;
}

@Component({
  selector: 'app-passive-selector',
  templateUrl: './passive-selector.component.html',
  styleUrls: ['./passive-selector.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PassiveSelectorComponent implements OnDestroy {
  // Estado del juego
  vidasMaximas = 3;
  vidas = 3;
  puntaje = 0;
  tiempoLimite = 7; // Segundos por cada oración
  tiempoRestante = 7;
  intervaloTiempo: any = null;

  juegoTerminado = false;
  juegoIniciado = false;
  mensajeFeedback = '';
  claseFeedback = '';

  // Banco de preguntas sobre Voz Pasiva (Inglés IV)
  bancoPreguntas: PreguntaPasiva[] = [
    {
      id: 1,
      oracionActiva: 'The dog ate the pizza 🍕',
      opciones: [
        { texto: 'The pizza was eaten by the dog', esCorrecta: true },
        { texto: 'The pizza is eaten by the dog', esCorrecta: false },
        { texto: 'The dog was eaten by the pizza', esCorrecta: false }
      ],
      explicacion: 'Pasado simple pasivo: Was + Past Participle (eaten).'
    },
    {
      id: 2,
      oracionActiva: 'Shakespeare wrote Hamlet 📜',
      opciones: [
        { texto: 'Hamlet is written by Shakespeare', esCorrecta: false },
        { texto: 'Hamlet was written by Shakespeare', esCorrecta: true },
        { texto: 'Hamlet has written by Shakespeare', esCorrecta: false }
      ],
      explicacion: 'Acción completada en el pasado: Was written.'
    },
    {
      id: 3,
      oracionActiva: 'Chefs prepare delicious meals 👨‍🍳',
      opciones: [
        { texto: 'Delicious meals were prepared by chefs', esCorrecta: false },
        { texto: 'Delicious meals are prepared by chefs', esCorrecta: true },
        { texto: 'Delicious meals have prepared by chefs', esCorrecta: false }
      ],
      explicacion: 'Presente simple pasivo (hábitos): Are + Past Participle.'
    },
    {
      id: 4,
      oracionActiva: 'The company built a new bridge 🌉',
      opciones: [
        { texto: 'A new bridge was built by the company', esCorrecta: true },
        { texto: 'A new bridge was builded by the company', esCorrecta: false },
        { texto: 'A new bridge is built by the company', esCorrecta: false }
      ],
      explicacion: 'Participio de "build" es "built".'
    },
    {
      id: 5,
      oracionActiva: 'Scientists discovered a new planet 🪐',
      opciones: [
        { texto: 'A new planet was discovered by scientists', esCorrecta: true },
        { texto: 'A new planet is discovered by scientists', esCorrecta: false },
        { texto: 'A new planet were discovered by scientists', esCorrecta: false }
      ],
      explicacion: 'Sujeto singular (A new planet) requiere "was".'
    }
  ];

  // Copia de pendientes para evitar repeticiones consecutivas
  pendientesPreguntas: PreguntaPasiva[] = [];
  preguntaActual!: PreguntaPasiva;
  opcionesMezcladas: OpcionPasiva[] = [];

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      heart,
      heartOutline,
      timeOutline,
      reloadOutline,
      arrowBackOutline,
      playCircle
    });
  }

  ngOnDestroy() {
    this.detenerTemporizador();
  }

  iniciarJuego() {
    this.vidas = this.vidasMaximas;
    this.puntaje = 0;
    this.juegoTerminado = false;
    this.juegoIniciado = true;
    this.mensajeFeedback = '';

    // Copiamos el banco de preguntas completo para la nueva partida
    this.pendientesPreguntas = [...this.bancoPreguntas];
    this.siguientePregunta();
  }

  siguientePregunta() {
    if (this.vidas <= 0) {
      this.finalizarJuego();
      return;
    }

    // Si ya respondieron todas las preguntas del banco, recargamos la bolsa
    if (this.pendientesPreguntas.length === 0) {
      this.pendientesPreguntas = [...this.bancoPreguntas];
    }

    // Seleccionamos y extraemos una pregunta aleatoria de las pendientes
    const indiceRandom = Math.floor(Math.random() * this.pendientesPreguntas.length);
    this.preguntaActual = this.pendientesPreguntas.splice(indiceRandom, 1)[0];

    // Mezclar las opciones de la pregunta actual
    this.opcionesMezcladas = [...this.preguntaActual.opciones].sort(() => Math.random() - 0.5);

    this.reiniciarTemporizador();
    this.cdr.detectChanges();
  }

  seleccionarOpcion(opcion: OpcionPasiva) {
    if (this.juegoTerminado || this.mensajeFeedback !== '') return;

    this.detenerTemporizador();

    if (opcion.esCorrecta) {
      this.puntaje += 15;
      this.mostrarFeedback('¡Correcto! Excelente uso de la voz pasiva', 'correcto');
    } else {
      this.vidas--;
      this.mostrarFeedback(`¡Incorrecto! ${this.preguntaActual.explicacion}`, 'incorrecto');
    }

    setTimeout(() => {
      this.mensajeFeedback = '';
      if (this.vidas > 0) {
        this.siguientePregunta();
      } else {
        this.finalizarJuego();
      }
      this.cdr.detectChanges();
    }, 1500);
  }

  reiniciarTemporizador() {
    this.detenerTemporizador();
    this.tiempoRestante = this.tiempoLimite;

    this.intervaloTiempo = setInterval(() => {
      this.tiempoRestante--;
      this.cdr.detectChanges();

      if (this.tiempoRestante <= 0) {
        this.detenerTemporizador();
        this.vidas--;
        this.mostrarFeedback('¡Tiempo agotado!', 'incorrecto');

        setTimeout(() => {
          this.mensajeFeedback = '';
          if (this.vidas > 0) {
            this.siguientePregunta();
          } else {
            this.finalizarJuego();
          }
          this.cdr.detectChanges();
        }, 1500);
      }
    }, 1000);
  }

  detenerTemporizador() {
    if (this.intervaloTiempo) {
      clearInterval(this.intervaloTiempo);
      this.intervaloTiempo = null;
    }
  }

  mostrarFeedback(msg: string, clase: string) {
    this.mensajeFeedback = msg;
    this.claseFeedback = clase;
    this.cdr.detectChanges();
  }

  finalizarJuego() {
    this.detenerTemporizador();
    this.juegoTerminado = true;
    this.cdr.detectChanges();
  }

  volverAlMenu() {
    this.detenerTemporizador();
    this.router.navigate(['/menuIngIV']);
  }
}
