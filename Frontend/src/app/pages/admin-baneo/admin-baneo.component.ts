import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  searchOutline, 
  banOutline, 
  checkmarkCircleOutline, 
  shieldOutline, 
  personOutline 
} from 'ionicons/icons';

import { HeaderComponent } from '../../components/header/header.component';
import { AdminService, UsuarioAdmin } from '../../services/admin.service.js';

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
export class AdminBaneoComponent implements OnInit {
  usuarios: UsuarioAdmin[] = [];
  filtro: string = '';
  cargando: boolean = false;
  errorMsg: string = '';

  constructor(
    private readonly adminService: AdminService,
    private readonly router: Router
  ) {
    addIcons({
      searchOutline,
      banOutline,
      checkmarkCircleOutline,
      shieldOutline,
      personOutline
    });
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.cargando = true;
    this.errorMsg = '';
    
    this.adminService.obtenerUsuarios().subscribe({
      next: (res: any) => {
        this.usuarios = res;
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error cargando usuarios:', err);
        this.errorMsg = 'No se pudo conectar con el servidor para obtener los usuarios.';
        this.cargando = false;
      }
    });
  }

  get usuariosFiltrados(): UsuarioAdmin[] {
    const busqueda = this.filtro.trim().toLowerCase();
    if (!busqueda) return this.usuarios;

    return this.usuarios.filter(u => 
      u.correo.toLowerCase().includes(busqueda) || 
      u.rol.toLowerCase().includes(busqueda)
    );
  }

  toggleBaneo(usuario: UsuarioAdmin) {
    const nuevoEstado = usuario.estado === 'RESTRINGIDO' ? 'ACTIVO' : 'RESTRINGIDO';
    
    this.adminService.cambiarEstadoUsuario(usuario.id, nuevoEstado).subscribe({
      next: (usuarioActualizado: any) => {
        usuario.estado = usuarioActualizado.estado;
      },
      error: (err: any) => {
        console.error('Error al cambiar el estado del usuario:', err);
        alert('No se pudo actualizar el estado del usuario.');
      }
    });
  }

  onAdminModeChange(isAdmin: boolean) {
    if (!isAdmin) {
      this.router.navigate(['/dashboard']);
    }
  }
}