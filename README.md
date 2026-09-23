# Miracle

**Descripción breve:** Miracle consiste en una aplicación web interactiva y multiplataforma diseñada para apoyar el proceso de aprendizaje de inglés de los estudiantes de la PUCV mediante ejercicios lúdicos y adaptativos.

## 1. Definición del Proyecto

### Problema o necesidad abordada
El aprendizaje de un idioma requiere práctica constante, pero los estudiantes universitarios a menudo carecen de herramientas de estudio interactivas que estén alineadas específicamente con los contenidos y el plan de aprendizaje de su institución. Las soluciones genéricas no siempre se adaptan al currículo exacto que el alumno debe aprobar en la universidad.

### Usuarios objetivo
Estudiantes de la Pontificia Universidad Católica de Valparaíso (PUCV) que se encuentran cursando las asignaturas de Inglés 1, Inglés 2, Inglés 3 o Inglés 4.

### Objetivos del proyecto
Diseñar, implementar y desplegar una aplicación web multiplataforma que ayude a los estudiantes en su proceso de aprender inglés mediante ejercicios prácticos, interactivos y adaptativos, basándose estrictamente en las unidades de aprendizaje definidas por la PUCV.

### Alcance y exclusiones
*   El sistema abarcará los planes de estudio desde Inglés 1 hasta Inglés 4.
*   Se implementará un mínimo de un juego interactivo por cada unidad de aprendizaje de estos ramos.
*   La aplicación incluirá dinámicas estilo "Kahoot" (selección de alternativas) y dinámicas de escritura libre para evaluar ortografía y gramática.
*   La solución será accesible a través de navegador web, Aplicación Web Progresiva (PWA) y aplicación Android.

## 2. Identificación del Equipo (PUEDE CAMBIAR)
*   **Diego Álvarez Garrido:** Desarrollo prototipos
*   **Javier Bórquez Diaz:** Desarrollo frontend
*   **Gabriel Reyes Muñoz:** Implementación backend

## 3. Principales Funcionalidades

La aplicación está diseñada para ofrecer un entorno de práctica integral, incluyendo:
*   **Actividades interactivas de aprendizaje:** Dinámicas de juego estilo "Kahoot" (selección de alternativas) y ejercicios de escritura libre para evaluar gramática y ortografía, abarcando un mínimo de un juego por unidad de aprendizaje de cada asignatura.
*   **Foro de consultas:** Un espacio colaborativo donde los estudiantes pueden enviar sus preguntas y dudas, las cuales podrán ser respondidas por los profesores u otros usuarios de la comunidad que conozcan del tema.
*   **Panel de administración y moderación:** Herramientas para que el administrador pueda gestionar la comunidad, incluyendo la capacidad de suspender temporal o permanentemente a los usuarios que hagan un mal uso del foro.
*   **Sistema de avisos globales:** Funcionalidad para que la administración envíe notificaciones informativas a todos los usuarios, comunicando eventos como ventanas de mantenimiento del sistema o nuevas actualizaciones.

## 4. Arquitectura y Tecnologías Utilizadas

El proyecto se construye sobre una arquitectura moderna, modular y multiplataforma:
*   **Frontend Multiplataforma:** Desarrollado con Angular como framework principal, Ionic Framework para los componentes visuales de interfaz, y Capacitor para la integración y empaquetación como aplicación móvil.
*   **Backend Principal:** API REST desarrollada en Node.js utilizando el framework NestJS para la lógica de negocio y gestión de usuarios.
*   **Servicio Especializado:** Microservicio independiente desarrollado en Python utilizando FastAPI para la lógica adaptativa y el consumo de datos web.
*   **Base de Datos:** Persistencia relacional de datos gestionada mediante PostgreSQL.
*   **Contenerización:** Todos los componentes se ejecutan en entornos aislados utilizando Docker y se orquestan localmente mediante Docker Compose.

## 5. Fuente de Información Web

Para enriquecer la experiencia de aprendizaje, el sistema consumirá información desde una fuente externa (API de diccionario, como Free Dictionary API). Esta fuente de información web se utilizará para extraer dinámicamente definiciones, ejemplos de uso y archivos de audio con la pronunciación real de las palabras, integrando estos datos directamente en las actividades interactivas.

## 6. Capacidad Adaptativa o Inteligente

La aplicación analizará el desempeño continuo del estudiante para personalizar su aprendizaje. A través del servicio en Python, el sistema evaluará los resultados de los juegos interactivos. Si detecta un patrón de errores frecuentes en un área particular (por ejemplo, dificultad con ciertos tiempos verbales en una unidad), el mecanismo adaptativo priorizará y generará automáticamente ejercicios de refuerzo enfocados en esos errores específicos, evitando que el alumno avance con vacíos de conocimiento.

## 7. Instrucciones de Instalación y Ejecución (NO ESTOY SEGURO DE ESTO)

El proyecto está contenerizado para garantizar una fácil instalación y un entorno de desarrollo reproducible.

### Prerrequisitos
Para ejecutar este proyecto localmente, necesitas tener instalado:
*   [Git](https://git-scm.com/)
*   [Docker y Docker Desktop](https://www.docker.com/products/docker-desktop/) (que incluye Docker Compose)

### Pasos de Instalación

**1. Clonar el repositorio:**
```
git clone https://github.com/JavierBor/MiracleWebAvanzada.git
cd ProyectoWeb
```

**2. Configuración de Variables de Entorno:**
El proyecto requiere variables de entorno para funcionar correctamente.
* En la raíz del proyecto (y/o en las carpetas de los servicios), encontrarás un archivo llamado .env.example.
* Crea una copia de este archivo, renómbralo a .env y completa los valores necesarios (por ejemplo, credenciales básicas de desarrollo para PostgreSQL). (Nota: Nunca subas el archivo .env real al repositorio).

3. Ejecución con Docker Compose:
Para construir las imágenes y levantar todos los servicios (Frontend, NestJS, FastAPI y PostgreSQL), ejecuta el siguiente comando en la raíz del proyecto:
```
docker-compose up --build
```

**4. Acceso a los Servicios:**
Una vez que los contenedores estén en ejecución, puedes acceder a los servicios a través de las siguientes rutas locales (puertos por defecto):

* Frontend (Angular/Ionic): http://localhost:8100 (o el puerto que configures)
* Backend Principal (NestJS): http://localhost:3000
* Servicio Adaptativo (Python/FastAPI): http://localhost:8000
* Base de Datos (PostgreSQL): localhost:5432

## 8. Pipeline DevSecOps y Despliegue
El proyecto integra un pipeline de integración y despliegue continuo (CI/CD) utilizando GitHub Actions.

Cada vez que se realiza un push a la rama principal, el pipeline ejecuta automáticamente:

* Instalación de dependencias y análisis de código (Linting).
* Pruebas unitarias de los diferentes servicios.
* Análisis estático de seguridad y detección de dependencias vulnerables o secretos expuestos.
* Construcción de las imágenes Docker.
* Despliegue automatizado en el ambiente de Staging.
* Enlace al ambiente de staging:
* Enlace al prototipo (Figma): https://www.figma.com/design/l8kGBlot0CO8z5RRXilRMD/MiracleWebAvanzada?node-id=0-1&t=oa9UOCwP1wDBTcsW-1
