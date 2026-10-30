import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { heart, heartOutline, timeOutline, reloadOutline, arrowBackOutline, playCircle } from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';

export interface ColocacionItem {
  frase: string;
  verboCorrecto: 'MAKE' | 'DO' | 'GIVE';
}

@Component({
  selector: 'app-the-3-buttons',
  templateUrl: './the-3-buttons.component.html',
  styleUrls: ['./the-3-buttons.component.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class The3ButtonsComponent implements OnInit, OnDestroy {
  // Configuración de juego
  vidasMaximas = 3;
  vidas = 3;
  puntaje = 0;
  tiempoLimite = 5; // Segundos por cada palabra
  tiempoRestante = 5;
  intervaloTiempo: any = null;

  juegoTerminado = false;
  juegoIniciado = false;
  mensajeFeedback = '';
  claseFeedback = '';

  // Banco de vocabulario de colocaciones (Inglés III)
  bancoPalabras: ColocacionItem[] = [
    { frase: 'a mistake', verboCorrecto: 'MAKE' },
    { frase: 'homework', verboCorrecto: 'DO' },
    { frase: 'a speech', verboCorrecto: 'GIVE' },
    { frase: 'a decision', verboCorrecto: 'MAKE' },
    { frase: 'a favor', verboCorrecto: 'DO' },
    { frase: 'advice', verboCorrecto: 'GIVE' },
    { frase: 'progress', verboCorrecto: 'MAKE' },
    { frase: 'exercise', verboCorrecto: 'DO' },
    { frase: 'a hug', verboCorrecto: 'GIVE' },
    { frase: 'money', verboCorrecto: 'MAKE' },
    { frase: 'the dishes', verboCorrecto: 'DO' },
    { frase: 'a ride', verboCorrecto: 'GIVE' }
  ];

  itemActual!: ColocacionItem;

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

  ngOnInit() {}

  ngOnDestroy() {
    this.detenerTemporizador();
  }

  iniciarJuego() {
    this.vidas = this.vidasMaximas;
    this.puntaje = 0;
    this.juegoTerminado = false;
    this.juegoIniciado = true;
    this.mensajeFeedback = '';
    this.siguientePalabra();
  }

  siguientePalabra() {
    if (this.vidas <= 0) {
      this.finalizarJuego();
      return;
    }

    const indiceRandom = Math.floor(Math.random() * this.bancoPalabras.length);
    this.itemActual = this.bancoPalabras[indiceRandom];

    this.reiniciarTemporizador();
    this.cdr.detectChanges();
  }

  responder(verboSeleccionado: 'MAKE' | 'DO' | 'GIVE') {
    if (this.juegoTerminado || this.mensajeFeedback !== '') return;

    this.detenerTemporizador();

    if (verboSeleccionado === this.itemActual.verboCorrecto) {
      this.puntaje += 10;
      this.mostrarFeedback('¡Correcto!', 'correcto');
    } else {
      this.vidas--;
      this.mostrarFeedback(`¡Incorrecto! Era: ${this.itemActual.verboCorrecto}`, 'incorrecto');
    }

    setTimeout(() => {
      this.mensajeFeedback = '';
      if (this.vidas > 0) {
        this.siguientePalabra();
      } else {
        this.finalizarJuego();
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  reiniciarTemporizador() {
    this.detenerTemporizador();
    this.tiempoRestante = this.tiempoLimite;

    this.intervaloTiempo = setInterval(() => {
      this.tiempoRestante--;
      
      // Fuerza la actualización del contador en la interfaz
      this.cdr.detectChanges();

      if (this.tiempoRestante <= 0) {
        this.detenerTemporizador();
        this.vidas--;
        this.mostrarFeedback('¡Tiempo agotado!', 'incorrecto');

        setTimeout(() => {
          this.mensajeFeedback = '';
          if (this.vidas > 0) {
            this.siguientePalabra();
          } else {
            this.finalizarJuego();
          }
          this.cdr.detectChanges();
        }, 1000);
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
    this.router.navigate(['/menuIngIII']);
  }
}