import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { searchOutline } from 'ionicons/icons';
import { HeaderComponent } from '../../components/header/header.component';

interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  estado: string;
  estadoClase: string;
  iniciales: string;
}

@Component({
  selector: 'app-admin-baneo',
  templateUrl: './admin-baneo.component.html',
  styleUrls: ['./admin-baneo.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonIcon,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdminBaneoComponent {
  
  filtroBusqueda: string = '';
  duracionDias: number | null = 3; // Por defecto seleccionado en 3 días como en el mockup
  notaAdmin: string = 'Comentario no debido';

  // Lista simulada de usuarios
  listaUsuarios: Usuario[] = [
    { id: '294021', nombre: 'Sarah Jenkins', correo: 'sarah.j@miracle.edu', estado: 'ACTIVO', estadoClase: 'activo', iniciales: 'SJ' },
    { id: '294022', nombre: 'Carlos Mendoza', correo: 'carlos.m@miracle.edu', estado: 'ADVERTIDO', estadoClase: 'advertido', iniciales: 'CM' },
    { id: '294023', nombre: 'Elena Rostova', correo: 'elena.rostov@miracle.edu', estado: 'RESTRINGIDO', estadoClase: 'restringido', iniciales: 'ER' },
    { id: '294024', nombre: 'Mateo Delgado', correo: 'mateo.d@miracle.edu', estado: 'ACTIVO', estadoClase: 'activo', iniciales: 'MD' },
  ];

  usuarioSeleccionado: Usuario = this.listaUsuarios[0]; // Seleccionado por defecto Sarah Jenkins

  constructor(private router: Router) {
    addIcons({ searchOutline });
  }

  // Filtrado reactivo en la lista
  get usuariosFiltrados(): Usuario[] {
    if (!this.filtroBusqueda) return this.listaUsuarios;
    const texto = this.filtroBusqueda.toLowerCase();
    return this.listaUsuarios.filter(u => 
      u.nombre.toLowerCase().includes(texto) || u.correo.toLowerCase().includes(texto)
    );
  }

  seleccionarUsuario(user: Usuario) {
    this.usuarioSeleccionado = user;
  }

  seleccionarDuracion(dias: number) {
    this.duracionDias = dias;
  }

  handleAdminModeChange(isAdmin: boolean) {
    if (!isAdmin) {
      this.router.navigate(['/dashboard']);
    }
  }

  cancelar() {
    this.router.navigate(['/admin']);
  }

  aplicarRestriccion() {
    if (!this.usuarioSeleccionado) return;
    
    console.log('Aplicando restricción:', {
      usuario: this.usuarioSeleccionado.nombre,
      id: this.usuarioSeleccionado.id,
      duracionDias: this.duracionDias,
      nota: this.notaAdmin
    });

    alert(`Restricción aplicada exitosamente a ${this.usuarioSeleccionado.nombre} por ${this.duracionDias} día(s).`);
    this.router.navigate(['/admin']);
  }
}