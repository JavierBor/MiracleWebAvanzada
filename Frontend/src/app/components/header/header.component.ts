import { Component, Input, Output, EventEmitter, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  personCircleOutline,
  chevronDownOutline,
  shieldCheckmarkOutline,
  logOutOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderComponent implements OnInit {
  // Propiedades configurables desde cada página
  @Input() badge = ''; // Ej: 'ING-I', 'ING-II', 'FORO'
  @Input() backText = 'Volver al Menú'; // Ej: 'Volver al Menú' o 'Volver'
  @Input() backRoute = '/dashboard'; // Ruta al hacer clic en volver
  @Input() showBack = true; // Si es false, oculta el botón de volver (útil en login/register/dashboard)

  // Avisa a la página padre cuando cambia el Modo Admin
  @Output() adminModeChange = new EventEmitter();

  showAccountMenu = false;
  isAdminMode = false;

  constructor(private router: Router) {
    addIcons({
      homeOutline,
      personCircleOutline,
      chevronDownOutline,
      shieldCheckmarkOutline,
      logOutOutline
    });
  }

  ngOnInit() {
    // Mantiene el estado de Modo Admin al navegar entre páginas
    const savedAdmin = localStorage.getItem('miracle_admin_mode');
    if (savedAdmin === 'true') {
      this.isAdminMode = true;
      this.adminModeChange.emit(true);
    }
  }

  toggleAccountMenu() {
    this.showAccountMenu = !this.showAccountMenu;
  }

  toggleAdminMode() {
    this.isAdminMode = !this.isAdminMode;
    this.showAccountMenu = false;
    localStorage.setItem('miracle_admin_mode', String(this.isAdminMode));
    this.adminModeChange.emit(this.isAdminMode);
  }

  cerrarSesion() {
    this.showAccountMenu = false;
    localStorage.removeItem('miracle_admin_mode');
    this.router.navigate(['/login']);
  }
}