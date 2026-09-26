import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonHeader, IonContent, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  personCircleOutline,
  chevronDownOutline,
  searchOutline,
  addOutline,
  shieldCheckmarkOutline,
  logOutOutline,
  trashOutline,
  closeOutline
} from 'ionicons/icons';

import { HeaderComponent } from '../../components/header/header.component';

interface PostForo {
  id: number;
  inicial: string;
  autor: string;
  tiempo: string;
  curso: string;
  categoria: string;
  titulo: string;
  contenido: string;
}

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonContent,
    IonIcon
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForoComponent {
  showAccountMenu = false;
  isAdminMode = false;

  terminoBusqueda = '';
  mostrarModalNuevo = false;

  // Campos para nueva publicación
  nuevoAutor = '';
  nuevoCurso = 'ING-II';
  nuevaCategoria = 'Gramática';
  nuevoTitulo = '';
  nuevoContenido = '';

  publicaciones: PostForo[] = [
    {
      id: 1,
      inicial: 'L',
      autor: 'Lucía Fernández',
      tiempo: 'Hace 15 minutos',
      curso: 'ING-II',
      categoria: 'Gramática',
      titulo: "¿Cuál es la diferencia real entre 'Present Perfect' y 'Past Simple'?",
      contenido: 'Siempre me confundo cuando tengo que usar uno u otro en una conversación fluida. ¿Tienen algún truco mental o regla rápida que les sirva para decidir al instante? ¡Gracias!'
    }
  ];

  constructor(private router: Router) {
    addIcons({
      homeOutline,
      personCircleOutline,
      chevronDownOutline,
      searchOutline,
      addOutline,
      shieldCheckmarkOutline,
      logOutOutline,
      trashOutline,
      closeOutline
    });
  }

  get publicacionesFiltradas(): PostForo[] {
    const filtro = this.terminoBusqueda.trim().toLowerCase();
    if (!filtro) {
      return this.publicaciones;
    }
    return this.publicaciones.filter(post =>
      post.titulo.toLowerCase().includes(filtro) ||
      post.contenido.toLowerCase().includes(filtro) ||
      post.autor.toLowerCase().includes(filtro) ||
      post.curso.toLowerCase().includes(filtro) ||
      post.categoria.toLowerCase().includes(filtro)
    );
  }

  toggleAccountMenu() {
    this.showAccountMenu = !this.showAccountMenu;
  }

  toggleAdminMode() {
    this.isAdminMode = !this.isAdminMode;
    this.showAccountMenu = false;
  }

  cerrarSesion() {
    this.showAccountMenu = false;
    this.router.navigate(['/login']);
  }

  abrirModalNuevaPublicacion() {
    this.mostrarModalNuevo = true;
  }

  cerrarModalNuevaPublicacion() {
    this.mostrarModalNuevo = false;
    this.nuevoTitulo = '';
    this.nuevoContenido = '';
  }

  crearPublicacion() {
    if (!this.nuevoTitulo.trim() || !this.nuevoContenido.trim()) {
      return;
    }

    const nombreAutor = this.nuevoAutor.trim() || 'Estudiante Miracle';
    const nueva: PostForo = {
      id: Date.now(),
      inicial: nombreAutor.charAt(0).toUpperCase(),
      autor: nombreAutor,
      tiempo: 'Justo ahora',
      curso: this.nuevoCurso,
      categoria: this.nuevaCategoria,
      titulo: this.nuevoTitulo.trim(),
      contenido: this.nuevoContenido.trim()
    };

    this.publicaciones.unshift(nueva);
    this.cerrarModalNuevaPublicacion();
  }

  eliminarPublicacion(id: number, event: Event) {
    event.stopPropagation();
    this.publicaciones = this.publicaciones.filter(p => p.id !== id);
  }
}