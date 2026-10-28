import { Component, Input, Output, EventEmitter, OnInit, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  arrowBackOutline,
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
  @Input() badge = ''; 
  @Input() backText = 'Volver'; 
  @Input() backRoute = '/dashboard'; 
  @Input() showBack = true; 
  @Input() showHistoryBack = false;

  @Output() adminModeChange = new EventEmitter<boolean>();

  showAccountMenu = false;
  isAdminMode = false;
  isUserAdmin = false; // Propiedad para validar el rol real del usuario

  constructor(private router: Router, private location: Location) {
    addIcons({
      homeOutline,
      arrowBackOutline,
      personCircleOutline,
      chevronDownOutline,
      shieldCheckmarkOutline,
      logOutOutline
    });
  }

  ngOnInit() {
    // 1. Validamos si el usuario actualmente autenticado es administrador
    this.verificarRolUsuario();

    // 2. Solo si el usuario tiene rol de ADMIN recuperamos el estado guardado
    const savedAdmin = localStorage.getItem('miracle_admin_mode');
    if (savedAdmin === 'true' && this.isUserAdmin) {
      this.isAdminMode = true;
      this.adminModeChange.emit(true);
    }
  }

  verificarRolUsuario() {
    const usuarioString = localStorage.getItem('user') || localStorage.getItem('usuario');
    if (usuarioString) {
      try {
        const user = JSON.parse(usuarioString);
        this.isUserAdmin = user.rol === 'ADMIN' || user.role === 'ADMIN';
      } catch (e) {
        this.isUserAdmin = false;
      }
    } else {
      this.isUserAdmin = localStorage.getItem('user_role') === 'ADMIN';
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-wrapper')) {
      this.showAccountMenu = false;
    }
  }

  // Método para volver a la página/pestaña anterior del historial
  goBack() {
    this.location.back();
  }

  toggleAccountMenu() {
    this.showAccountMenu = !this.showAccountMenu;
  }

  toggleAdminMode() {
    this.isAdminMode = !this.isAdminMode;
    this.showAccountMenu = false;
    localStorage.setItem('miracle_admin_mode', String(this.isAdminMode));
    
    // Emitimos el cambio al componente padre (Dashboard o Menú Admin)
    this.adminModeChange.emit(this.isAdminMode);
  }

  cerrarSesion() {
    this.showAccountMenu = false;
    localStorage.removeItem('miracle_admin_mode');
    localStorage.removeItem('user');
    localStorage.removeItem('usuario');
    localStorage.removeItem('user_role');
    this.router.navigate(['/login']);
  }
}