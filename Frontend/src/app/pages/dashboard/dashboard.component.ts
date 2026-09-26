import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // 1. Importa OnInit
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  bookOutline,
  chatbubblesOutline,
  arrowForwardOutline,
  sparklesOutline
} from 'ionicons/icons';

import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    IonIcon,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardComponent implements OnInit { // 2. Implementa OnInit
  isAdminMode = false;

  cursos = [
    {
      sigla: 'ING-I',
      titulo: 'Inglés I',
      descripcion: 'Practica vocabulario contable/incontable, profesiones y estructuras con There is / There are.',
      ruta: '/menuIngI',
      emoji: '📘'
    },
    {
      sigla: 'ING-II',
      titulo: 'Inglés II',
      descripcion: 'Domina los verbos en pasado simple, tiempos verbales (Present Simple vs Continuous) y medios de transporte.',
      ruta: '/menuIngII',
      emoji: '🚀'
    },
    {
      sigla: 'ING-III',
      titulo: 'Inglés III',
      descripcion: 'Entrena colocaciones con Make/Do/Give, armado de consejos y predicciones futuras con Will y Might.',
      ruta: '/menuIngIII',
      emoji: '🔮'
    },
    {
      sigla: 'ING-IV',
      titulo: 'Inglés IV',
      descripcion: 'Perfecciona la voz pasiva, el primer condicional y vocabulario avanzado de personalidad.',
      ruta: '/menuIngIV',
      emoji: '🧠'
    }
  ];

  constructor(private router: Router) {
    addIcons({
      bookOutline,
      chatbubblesOutline,
      arrowForwardOutline,
      sparklesOutline
    });
  }

  ngOnInit() {
    // 3. Si recargas la página y el modo admin está activo, redirige automáticamente al menú admin
    const savedAdmin = localStorage.getItem('miracle_admin_mode');
    if (savedAdmin === 'true') {
      this.router.navigate(['/admin']);
    }
  }

  // 4. Captura el cambio cuando haces clic en "Modo Admin" desde el menú desplegable del header
  onAdminModeChange(isAdmin: boolean) {
    this.isAdminMode = isAdmin;
    if (isAdmin) {
      this.router.navigate(['/admin']);
    }
  }

  irARuta(ruta: string) {
    this.router.navigate([ruta]);
  }
}