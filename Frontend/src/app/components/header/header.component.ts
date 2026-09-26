import { Component, Input, Output, EventEmitter, OnInit, HostListener, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, Location } from '@angular/common'; // <-- Importa Location
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
  @Input() showHistoryBack = false; // <-- NUEVO: Controla si se usa el botón de historial anterior

  @Output() adminModeChange = new EventEmitter<boolean>();

  showAccountMenu = false;
  isAdminMode = false;

  constructor(private router: Router, private location: Location) { // <-- Inyecta Location
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
    const savedAdmin = localStorage.getItem('miracle_admin_mode');
    if (savedAdmin === 'true') {
      this.isAdminMode = true;
      this.adminModeChange.emit(true);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.account-wrapper')) {
      this.showAccountMenu = false;
    }
  }

  // NUEVO: Método para volver a la página/pestaña anterior del historial
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
    
    // Emitimos el cambio al componente padre (ya sea Dashboard o Menú Admin)
    this.adminModeChange.emit(this.isAdminMode);
  }
  cerrarSesion() {
    this.showAccountMenu = false;
    localStorage.removeItem('miracle_admin_mode');
    this.router.navigate(['/login']);
  }
}