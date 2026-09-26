import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  personCircleOutline,
  chevronDownOutline,
  checkmarkOutline,
  shieldCheckmarkOutline,
  logOutOutline
} from 'ionicons/icons';

import { HeaderComponent } from '../../components/header/header.component';

interface VerbItem {
  base: string;
  past: string[];
  level: 'Normal' | 'Difícil' | 'Experto';
}

@Component({
  selector: 'app-verb-transformer',
  templateUrl: './verb-transformer.component.html',
  styleUrls: ['./verb-transformer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonContent,
    IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VerbTransformerComponent implements OnInit {
  // Menú Mi Cuenta
  showAccountMenu = false;
  isAdminMode = false;

  // Estado del juego
  racha = 0;
  mejorRacha = 0;
  nivelActual: 'Normal' | 'Difícil' | 'Experto' = 'Normal';

  verboActual!: VerbItem;
  respuestaUsuario = '';
  feedbackMensaje = '';
  feedbackTipo: 'correcto' | 'error' | '' = '';

  // Banco de verbos por dificultad
  verbos: VerbItem[] = [
    // Nivel Normal (0 a 4 de racha)
    { base: 'EAT', past: ['ate'], level: 'Normal' },
    { base: 'GO', past: ['went'], level: 'Normal' },
    { base: 'PLAY', past: ['played'], level: 'Normal' },
    { base: 'SEE', past: ['saw'], level: 'Normal' },
    { base: 'HAVE', past: ['had'], level: 'Normal' },
    { base: 'MAKE', past: ['made'], level: 'Normal' },
    { base: 'DO', past: ['did'], level: 'Normal' },
    { base: 'WORK', past: ['worked'], level: 'Normal' },
    { base: 'TAKE', past: ['took'], level: 'Normal' },
    { base: 'COME', past: ['came'], level: 'Normal' },

    // Nivel Difícil (5 a 9 de racha)
    { base: 'BUY', past: ['bought'], level: 'Difícil' },
    { base: 'THINK', past: ['thought'], level: 'Difícil' },
    { base: 'SPEAK', past: ['spoke'], level: 'Difícil' },
    { base: 'WRITE', past: ['wrote'], level: 'Difícil' },
    { base: 'BREAK', past: ['broke'], level: 'Difícil' },
    { base: 'STUDY', past: ['studied'], level: 'Difícil' },
    { base: 'BEGIN', past: ['began'], level: 'Difícil' },
    { base: 'FIND', past: ['found'], level: 'Difícil' },
    { base: 'KNOW', past: ['knew'], level: 'Difícil' },
    { base: 'CHOOSE', past: ['chose'], level: 'Difícil' },

    // Nivel Experto (10+ de racha)
    { base: 'TEACH', past: ['taught'], level: 'Experto' },
    { base: 'CATCH', past: ['caught'], level: 'Experto' },
    { base: 'BRING', past: ['brought'], level: 'Experto' },
    { base: 'FORGET', past: ['forgot'], level: 'Experto' },
    { base: 'FREEZE', past: ['froze'], level: 'Experto' },
    { base: 'UNDERSTAND', past: ['understood'], level: 'Experto' },
    { base: 'WITHDRAW', past: ['withdrew'], level: 'Experto' },
    { base: 'SHAKE', past: ['shook'], level: 'Experto' },
    { base: 'STEAL', past: ['stole'], level: 'Experto' },
    { base: 'FORGIVE', past: ['forgave'], level: 'Experto' }
  ];

  constructor(private router: Router) {
    addIcons({
      homeOutline,
      personCircleOutline,
      chevronDownOutline,
      checkmarkOutline,
      shieldCheckmarkOutline,
      logOutOutline
    });
  }

  ngOnInit() {
    // Recuperar mejor racha guardada si existe
    const guardada = localStorage.getItem('miracle_best_streak_verbs');
    if (guardada) {
      this.mejorRacha = parseInt(guardada, 10);
    }
    this.siguienteVerbo();
  }

  toggleAccountMenu() {
    this.showAccountMenu = !this.showAccountMenu;
  }

  toggleAdminMode() {
    this.isAdminMode = !this.isAdminMode;
    this.showAccountMenu = false;
  }

  cerrarSesion() {
    this.showAccountMenu = false;
    this.router.navigate(['/login']);
  }

  actualizarNivel() {
    if (this.racha >= 10) {
      this.nivelActual = 'Experto';
    } else if (this.racha >= 5) {
      this.nivelActual = 'Difícil';
    } else {
      this.nivelActual = 'Normal';
    }
  }

  siguienteVerbo() {
    this.actualizarNivel();
    const disponibles = this.verbos.filter(
      v => v.level === this.nivelActual && v.base !== this.verboActual?.base
    );
    const indice = Math.floor(Math.random() * disponibles.length);
    this.verboActual = disponibles[indice];
    this.respuestaUsuario = '';
  }

comprobar() {
    const entrada = this.respuestaUsuario.trim().toLowerCase();
    if (!entrada) return;

    if (this.verboActual.past.includes(entrada)) {
    // Acierto
    this.racha++;
    if (this.racha > this.mejorRacha) {
        this.mejorRacha = this.racha;
        localStorage.setItem('miracle_best_streak_verbs', this.mejorRacha.toString());
    }
    this.feedbackTipo = 'correcto';
    this.feedbackMensaje = '¡Correcto!';
    this.siguienteVerbo();
    } else {
    // Error: guardamos los valores antes de cambiar al siguiente verbo
    const verboFallado = this.verboActual.base;
    const respuestaCorrecta = this.verboActual.past[0].toUpperCase();
    
    this.racha = 0;
    this.feedbackTipo = 'error';
    this.feedbackMensaje = 'Incorrecto. El pasado de ' + verboFallado + ' es "' + respuestaCorrecta + '". ¡Racha reiniciada!';
    this.siguienteVerbo();
    }

    // Limpiar mensaje luego de 2.5 segundos
    setTimeout(() => {
    this.feedbackMensaje = '';
    this.feedbackTipo = '';
    }, 2500);
}
}