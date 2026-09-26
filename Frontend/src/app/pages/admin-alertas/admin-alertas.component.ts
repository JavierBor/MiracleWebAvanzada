import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para los ngModel
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { HeaderComponent } from '../../components/header/header.component'; // Ajusta la ruta a tu header

@Component({
  selector: 'app-admin-alertas',
  templateUrl: './admin-alertas.component.html',
  styleUrls: ['./admin-alertas.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminAlertasComponent {
  
  tipoEnvio: string = 'todos';
  correos: string = '';
  asunto: string = '';
  mensaje: string = '';

  constructor(private router: Router) {}

  // Controla si desactivan el modo admin desde el header para sacarlos al dashboard
  handleAdminModeChange(isAdmin: boolean) {
    if (!isAdmin) {
      this.router.navigate(['/dashboard']);
    }
  }

  enviarAlerta() {
    console.log('Enviando alerta:', {
      tipo: this.tipoEnvio,
      correos: this.correos,
      asunto: this.asunto,
      mensaje: this.mensaje
    });

    // Aquí puedes integrar tu servicio para conectar con el backend y mandar la alerta.
    alert('¡Alerta enviada con éxito!');
    
    // Opcional: limpiar formulario o redirigir al menú admin
    this.router.navigate(['/admin']);
  }
}