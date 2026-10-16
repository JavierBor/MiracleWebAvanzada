// 1. Agrega ChangeDetectorRef en la importación de @angular/core
import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
// ... el resto de tus imports de Ionic e Icons se mantienen iguales ...
import { VocabularioService, DesafioJuego } from '../../services/vocabulario.service';

import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-juego-vocabulario',
  templateUrl: './juego-vocabulario.component.html',
  styleUrls: ['./juego-vocabulario.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent
    // ... tus componentes de Ionic ...
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class JuegoVocabularioComponent implements OnInit {
  desafio: DesafioJuego | null = null;
  cargando = false;
  errorMsg = '';
  
  opcionSeleccionada: string | null = null;
  esCorrecto: boolean | null = null;
  puntaje: number = 0;

  palabrasDisponibles: string[] = [
    // Entorno universitario y estudio
    'student', 'teacher', 'book', 'pen', 'desk', 'class', 'school', 'university', 'exam', 'paper',
    // Familia y personas
    'family', 'brother', 'sister', 'mother', 'father', 'friend', 'person', 'boy', 'girl',
    // Objetos y lugares cotidianos
    'house', 'room', 'door', 'window', 'table', 'chair', 'car', 'bus', 'city', 'country',
    // Tiempo y rutinas
    'morning', 'afternoon', 'night', 'day', 'week', 'month', 'year', 'time', 'today',
    // Comida y animales
    'water', 'food', 'apple', 'bread', 'coffee', 'dog', 'cat',
    // Conceptos básicos
    'work', 'job', 'money', 'name', 'number', 'color'
  ];
  // 1. Agregamos la "memoria" de la partida
  palabrasUsadas: string[] = [];

  constructor(
    private readonly vocabularioService: VocabularioService,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarNuevaRonda();
  }

  cargarNuevaRonda(palabra?: string) {
    this.cargando = true;
    this.errorMsg = '';
    this.opcionSeleccionada = null;
    this.esCorrecto = null;
    this.cdr.markForCheck(); 

    const palabraObjetivo = palabra || this.palabrasDisponibles[Math.floor(Math.random() * this.palabrasDisponibles.length)];

    // 2. Enviamos el historial al servicio
    this.vocabularioService.obtenerDesafio(palabraObjetivo, this.palabrasUsadas).subscribe({
      next: (data) => {
        this.desafio = data;
        this.cargando = false;
        
        // 3. Guardamos la palabra ganadora para que no vuelva a salir
        if (!this.palabrasUsadas.includes(data.palabra_correcta)) {
          this.palabrasUsadas.push(data.palabra_correcta);
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = 'No se pudo conectar con el servidor para cargar el desafío.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  verificarRespuesta(opcion: string) {
    if (this.opcionSeleccionada !== null || !this.desafio) return;

    this.opcionSeleccionada = opcion;
    this.esCorrecto = (opcion === this.desafio.palabra_correcta);

    if (this.esCorrecto) {
      this.puntaje += 10;
    }
    this.cdr.detectChanges(); // Asegurar respuesta visual inmediata
  }

  reproducirAudio() {
    if ('speechSynthesis' in window && this.desafio) {
      const utterance = new SpeechSynthesisUtterance(this.desafio.palabra_correcta);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  }
}