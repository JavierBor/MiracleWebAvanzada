
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef
} from '@angular/core';
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
import { environment } from '../../../environments/environment';

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

  // URL del backend según el entorno de Angular
  private readonly apiUrl = `${environment.apiUrl}/api/foro`;

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

  // Actualiza el foro cada vez que se entra a la vista
  ionViewWillEnter() {
    this.cargarHistorialForo();
  }

  // ==========================================
  // CARGAR PUBLICACIONES DESDE POSTGRESQL
  // ==========================================

  cargarHistorialForo() {
    this.http.get<any[]>(`${this.apiUrl}/todas`)
      .subscribe({
        next: (res) => {
          this.publicaciones = res.map((post: any) => {
            let cursoStr = 'Foro';
            let tituloStr = 'Consulta';
            let contenidoStr = post.contenido;

            // Separar curso, título y contenido
            // Formato: [ING-II] Título - Contenido
            const match = post.contenido.match(
              /^\[(.*?)\] (.*?) - ([\s\S]*)$/
            );

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

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(
            'Error cargando el historial del foro',
            err
          );
        }
      });
  }

  // ==========================================
  // MOTOR DE BÚSQUEDA INTELIGENTE
  // ==========================================

  buscarEnForo() {
    const termino = this.terminoBusqueda.trim();

    if (termino === '') {
      this.metadatosBusqueda = null;
      this.publicacionesFiltradas = this.publicaciones;
      this.cdr.detectChanges();
      return;
    }

    this.http.get<any>(`${this.apiUrl}/buscar`, {
      params: { q: termino }
    })
      .subscribe({
        next: (res) => {
          this.publicacionesFiltradas = res.resultados.map(
            (post: any) => {
              let cursoStr = 'Foro';
              let tituloStr = 'Consulta';
              let contenidoStr = post.contenido;

              const match = post.contenido.match(
                /^\[(.*?)\] (.*?) - ([\s\S]*)$/
              );

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
            }
          );

          this.metadatosBusqueda = res.metadatos_busqueda;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error(
            'Error en búsqueda inteligente',
            err
          );

          this.publicacionesFiltradas = [];
          this.metadatosBusqueda = null;
          this.cdr.detectChanges();
        }
      });
  }

  // ==========================================
  // MENÚ DE CUENTA
  // ==========================================

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

  // ==========================================
  // MODAL DE NUEVA PUBLICACIÓN
  // ==========================================

  abrirModalNuevaPublicacion() {
    this.mostrarModalNuevo = true;
  }

  cerrarModalNuevaPublicacion() {
    this.mostrarModalNuevo = false;
    this.nuevoTitulo = '';
    this.nuevoContenido = '';
  }

  // ==========================================
  // CREAR PUBLICACIÓN EN POSTGRESQL
  // ==========================================

  crearPublicacion() {
    if (
      !this.nuevoTitulo.trim() ||
      !this.nuevoContenido.trim()
    ) {
      return;
    }

    const nombreAutor =
      this.nuevoAutor.trim() || 'Estudiante Miracle';

    const nuevaPublicacion = {
      autor: nombreAutor,
      curso: this.nuevoCurso,
      categoria: this.nuevaCategoria,
      titulo: this.nuevoTitulo.trim(),
      contenido: this.nuevoContenido.trim()
    };

    // Petición HTTP hacia NestJS
    this.http.post<any>(
      `${this.apiUrl}/crear`,
      nuevaPublicacion
    )
      .subscribe({
        next: (res) => {
          const postGuardado: PostForo = {
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
          console.error(
            'Error guardando en la base de datos',
            err
          );

          alert(
            'No se pudo guardar la publicación. Inténtalo nuevamente.'
          );
        }
      });
  }

  // ==========================================
  // ELIMINAR PUBLICACIÓN DE LA VISTA
  // ==========================================

  eliminarPublicacion(id: number, event: Event) {
    event.stopPropagation();

    this.publicaciones = this.publicaciones.filter(
      p => p.id !== id
    );

    this.publicacionesFiltradas =
      this.publicacionesFiltradas.filter(
        p => p.id !== id
      );

    this.cdr.detectChanges();
  }
}
