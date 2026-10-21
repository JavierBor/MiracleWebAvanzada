import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  inicial?: string;
  autor?: string;
  tiempo?: string;
  curso?: string;
  categoria?: string;
  titulo?: string;
  contenido: string;
  score_relevancia?: number;
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
    HttpClientModule,
    IonHeader,
    IonContent,
    IonIcon,
    HeaderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ForoComponent {
  showAccountMenu = false;
  isAdminMode = false;

  terminoBusqueda = '';
  mostrarModalNuevo = false;
  metadatosBusqueda: any = null;

  // Campos para nueva publicación
  nuevoAutor = '';
  nuevoCurso = 'ING-II';
  nuevaCategoria = 'Gramática';
  nuevoTitulo = '';
  nuevoContenido = '';

  publicaciones: PostForo[] = [];
  publicacionesFiltradas: PostForo[] = [];

  // Inyectamos ChangeDetectorRef correctamente
  constructor(
    private router: Router, 
    private http: HttpClient,
    private cdr: ChangeDetectorRef 
  ) {
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

  // Usamos ionViewWillEnter en lugar de ngOnInit para asegurar que Ionic siempre actualice la vista
  ionViewWillEnter() {
    this.cargarHistorialForo();
  }

  // Trae las publicaciones desde PostgreSQL vía NestJS
  cargarHistorialForo() {
    this.http.get('http://localhost:3000/api/foro/todas')
      .subscribe({
        next: (res: any) => {
          this.publicaciones = res.map((post: any) => {
            let cursoStr = 'Foro';
            let tituloStr = 'Consulta';
            let contenidoStr = post.contenido;

            // Se corrigió el regex que estaba cortado en varias líneas
            const match = post.contenido.match(/\[(.*?)\] (.*?) - (.*)/);
            if (match) {
              cursoStr = match[1];
              tituloStr = match[2];
              contenidoStr = match[3];
            }

            return {
              id: post.id,
              inicial: 'U', 
              autor: 'Estudiante Miracle',
              tiempo: 'Historial',
              curso: cursoStr,
              categoria: 'General',
              titulo: tituloStr,
              contenido: contenidoStr
            };
          });
          
          if (this.terminoBusqueda.trim() === '') {
            this.publicacionesFiltradas = this.publicaciones;
          }

          // Forzamos la detección de cambios
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando el historial del foro', err)
      });
  }

  // --- MOTOR DE BÚSQUEDA INTELIGENTE ---
  buscarEnForo() {
    if (this.terminoBusqueda.trim() === '') {
      this.metadatosBusqueda = null;
      this.publicacionesFiltradas = this.publicaciones;
      this.cdr.detectChanges();
      return;
    }

    this.http.get(`http://localhost:3000/api/foro/buscar?q=${this.terminoBusqueda}`)
      .subscribe({
        next: (res: any) => {
          this.publicacionesFiltradas = res.resultados.map((post: any) => {
            let cursoStr = 'Foro';
            let tituloStr = 'Consulta';
            let contenidoStr = post.contenido;

            const match = post.contenido.match(/\[(.*?)\] (.*?) - (.*)/);
            if (match) {
              cursoStr = match[1];
              tituloStr = match[2];
              contenidoStr = match[3];
            }

            return {
              id: post.id,
              inicial: 'U',
              autor: 'Estudiante Miracle',
              tiempo: 'Búsqueda',
              curso: cursoStr,
              categoria: 'General',
              titulo: tituloStr,
              contenido: contenidoStr,
              score_relevancia: post.score_relevancia
            };
          });
          this.metadatosBusqueda = res.metadatos_busqueda;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error en búsqueda inteligente', err);
          this.publicacionesFiltradas = [];
          this.metadatosBusqueda = null;
          this.cdr.detectChanges();
        }
      });
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
    
    const nuevaPublicacion = {
      autor: nombreAutor,
      curso: this.nuevoCurso,
      categoria: this.nuevaCategoria,
      titulo: this.nuevoTitulo.trim(),
      contenido: this.nuevoContenido.trim()
    };

    // Petición HTTP real hacia NestJS
    this.http.post('http://localhost:3000/api/foro/crear', nuevaPublicacion)
      .subscribe({
        next: (res: any) => {
          const postGuardado = {
            id: res.id,
            inicial: nombreAutor.charAt(0).toUpperCase(),
            autor: nombreAutor,
            tiempo: 'Justo ahora',
            curso: this.nuevoCurso,
            categoria: this.nuevaCategoria,
            titulo: this.nuevoTitulo.trim(),
            contenido: this.nuevoContenido.trim()
          };

          this.publicaciones.unshift(postGuardado);
          
          if (this.terminoBusqueda.trim() === '') {
            this.publicacionesFiltradas = this.publicaciones;
          }
          
          this.cerrarModalNuevaPublicacion();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error guardando en la base de datos', err);
          alert('Hubo un error al guardar tu publicación. Asegúrate de tener un usuario con ID 1 en Prisma Studio.');
        }
      });
  }

  eliminarPublicacion(id: number, event: Event) {
    event.stopPropagation();
    this.publicaciones = this.publicaciones.filter(p => p.id !== id);
    this.publicacionesFiltradas = this.publicacionesFiltradas.filter(p => p.id !== id);
    this.cdr.detectChanges();
  }
}