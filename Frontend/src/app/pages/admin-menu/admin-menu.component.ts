import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // 1. Importa Router si no lo tienes
import { IonContent } from '@ionic/angular';
import { HeaderComponent } from '../../components/header/header.component';


@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonContent,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminMenuComponent {
  
  constructor(private router: Router) {} // 2. Inyecta Router

  // 3. Método que detecta si el usuario desactivó el modo admin
  handleAdminModeChange(isAdmin: boolean) {
    if (!isAdmin) {
      // Si pasa a false ("Salir de Modo Admin"), lo mandamos al menú principal del usuario
      this.router.navigate(['/dashboard']); // Cambia '/dashboard' por la ruta de tu menú principal si se llama diferente
    }
  }
}