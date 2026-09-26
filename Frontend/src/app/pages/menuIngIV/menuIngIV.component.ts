import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  personCircleOutline,
  chevronDownOutline,
  playCircleOutline,
  shieldCheckmarkOutline,
  logOutOutline
} from 'ionicons/icons';

import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-menu-ing-iv',
  templateUrl: './menuIngIV.component.html',
  styleUrls: ['./menuIngIV.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonContent,
    IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenuIngIVComponent {
  showAccountMenu = false;
  isAdminMode = false;

  constructor(private router: Router) {
    addIcons({
      homeOutline,
      personCircleOutline,
      chevronDownOutline,
      playCircleOutline,
      shieldCheckmarkOutline,
      logOutOutline
    });
  }

  toggleAccountMenu() {
    this.showAccountMenu = !this.showAccountMenu;
  }

  toggleAdminMode() {
    this.isAdminMode = !this.isAdminMode;
    this.showAccountMenu = false;
    console.log('Modo Admin:', this.isAdminMode ? 'Activado' : 'Desactivado');
  }

  cerrarSesion() {
    this.showAccountMenu = false;
    this.router.navigate(['/login']);
  }

  irAJuego(ruta: string) {
    this.router.navigate([ruta]);
  }
}