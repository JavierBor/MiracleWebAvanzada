import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastController } from '@ionic/angular'; 
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-admin-alertas',
  templateUrl: './admin-alertas.component.html',
  styleUrls: ['./admin-alertas.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent], // Ya no está IonicModule
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminAlertasComponent {
  tipoEnvio: string = 'todos'; // Por defecto estará marcado en masivo
  emailDestino: string = '';
  asuntoAlerta: string = '';
  mensajeAlerta: string = '';
  cargando: boolean = false;

  constructor(
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  async enviarAlerta() {
    if (this.tipoEnvio === 'individuales' && !this.emailDestino) {
      this.mostrarToast('Por favor, ingresa el correo del destinatario.', 'warning');
      return;
    }
    if (!this.asuntoAlerta || !this.mensajeAlerta) {
      this.mostrarToast('Por favor, completa el asunto y el mensaje.', 'warning');
      return;
    }

    this.cargando = true;

    const payload = {
      email: this.tipoEnvio === 'todos' ? 'todos' : this.emailDestino,
      asunto: this.asuntoAlerta,
      mensaje: this.mensajeAlerta
    };

    this.http.post('http://localhost:3000/mail/alerta', payload).subscribe({
      next: () => {
        this.mostrarToast('✅ Alerta enviada con éxito.', 'success');
        this.emailDestino = '';
        this.asuntoAlerta = '';
        this.mensajeAlerta = '';
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error enviando alerta:', err);
        this.mostrarToast('❌ Hubo un error al enviar la alerta.', 'danger');
        this.cargando = false;
      }
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }
}