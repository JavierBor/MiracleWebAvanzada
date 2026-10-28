import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { playCircleOutline } from 'ionicons/icons';

import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-menu-ing-i',
  templateUrl: './menuIngI.component.html',
  styleUrls: ['./menuIngI.component.scss'],
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
export class MenuIngIComponent {
  isAdminMode = false;

  constructor(private router: Router) {
    addIcons({
      playCircleOutline
    });
  }

  // Captura cuando el usuario activa el Modo Admin desde el Header
  onAdminModeChange(isAdmin: boolean) {
    this.isAdminMode = isAdmin;
    if (isAdmin) {
      this.router.navigate(['/admin']);
    }
  }

  irAJuego(ruta: string) {
    this.router.navigate([ruta]);
  }
}