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

## 2. Identificación del Equipo
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

## 7. Instrucciones de Instalación y Ejecución

El proyecto está contenerizado para garantizar una fácil instalación y un entorno de desarrollo reproducible.

### Prerrequisitos
Para ejecutar este proyecto localmente, necesitas tener instalado:
*   [Git](https://git-scm.com/)
*   [Docker y Docker Desktop](https://www.docker.com/products/docker-desktop/) (que incluye Docker Compose)
*   Se utilizo La version 24 de node, la version 11 de npm y python 3.11

### Pasos de Instalación

**1. Clonar el repositorio:**
```
git clone https://github.com/JavierBor/MiracleWebAvanzada.git
cd MiracleWebAvanzada
```

**2. Configuración de Variables de Entorno:**
El proyecto requiere variables de entorno para funcionar correctamente.
* En la raíz del proyecto (y/o en las carpetas de los servicios), encontrarás un archivo llamado .env.example.
* Crea una copia de este archivo, renómbralo a .env y completa los valores necesarios (por ejemplo, credenciales básicas de desarrollo para PostgreSQL). (Nota: Nunca subas el archivo .env real al repositorio).

**3. Ejecución con Docker Compose:**
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

# Entrega parcial 1 Miracle

## Documentación de arquitectura

### Diagrama de contexto.

```mermaid
flowchart LR

    EST["Estudiante"]
    SIS(("Sistema<br/>Miracle"))
    PROF["Profesor/Admin"]

    EST -->|"Resuelve ejercicios"| SIS
    EST -->|"Consulta foros"| SIS
    SIS -->|"Recibe retroalimentación"| EST

    PROF -->|"Monitorea el foro"| SIS
    SIS -->|"Recibe preguntas"| PROF
    PROF -->|"Restringir usuarios"| SIS
    PROF -->|"Enviar alertas"| SIS
```

### Diagrama de contenedores.

```mermaid
flowchart TB

    USER["Usuario"]

    subgraph SYSTEM["Sistema Miracle"]

        FRONT["Frontend Multiplataforma<br/>
        Ionic + Angular + Capacitor + Nginx<br/>
        Puerto: 8100<br/><br/>
        Rol: Proporciona la interfaz de usuario<br/>
        web y móvil adaptada, navegación por rutas,<br/>
        vistas de cursos, autenticación<br/>
        y módulos interactivos."]

        BACK["Backend Principal<br/>
        NestJS + Node.js + TypeScript<br/>
        Puerto: 3000<br/><br/>
        Rol: Orquesta la lógica del negocio,<br/>
        gestiona autenticación/autorización JWT,<br/>
        valida entradas con DTOs, expone la API REST<br/>
        principal y el endpoint de salud /health."]

        MICRO["Microservicio Especializado<br/>
        Python + FastAPI + Uvicorn<br/>
        Puerto: 8000<br/><br/>
        Rol: Procesa solicitudes internas<br/>
        delegadas por NestJS, analiza patrones<br/>
        de error y expone endpoints funcionales<br/>
        con verificación de salud /health."]

        DB[("Base de Datos Relacional<br/>
        PostgreSQL 15<br/>
        Puerto: 5432<br/><br/>
        Rol: Persistencia transaccional de usuarios,<br/>
        interacciones, catálogo de actividades<br/>
        y publicaciones del foro.")]
    end

    USER -->|"HTTPS"| FRONT

    FRONT -->|"API REST / JSON"| BACK

    BACK -->|"API REST interna"| MICRO

    BACK -->|"Prisma ORM"| DB
```

### Diagrama de Despliegue Preliminar.

```mermaid
flowchart LR

    %% =========================
    %% PIPELINE DEVSECOPS
    %% =========================
    subgraph GH["Pipeline DevSecOps - GitHub Actions"]

        J1["Job 1: CI y Seguridad<br/><br/>
        - Angular Frontend<br/>
        - NestJS Backend<br/>
        - Python Microservice<br/>
        - Lint y Tests<br/>
        - TruffleHog<br/>
        - Docker Compose Build"]

        J2["Job 2: Validación IaC<br/><br/>
        Terraform init<br/>
        Terraform fmt<br/>
        Terraform validate<br/>
        Terraform plan"]

        J3["Job 3: CD Staging<br/><br/>
        Despliegue continuo<br/>
        mediante Deploy Hook"]

        J1 --> J3
        J2 --> J3
    end

    %% =========================
    %% STAGING
    %% =========================
    J3 -->|"POST RENDER_DEPLOY_HOOK_URL"| RENDER["Render<br/>Ambiente Staging"]

    %% =========================
    %% ARQUITECTURA DE LA APP
    %% =========================
    subgraph NET["Red Virtual: miracle_network"]

        FRONT["Contenedor<br/>angular_frontend"]
        BACK["Contenedor<br/>nestjs_backend"]
        PY["Contenedor<br/>python_microservice"]
        DB[("Contenedor<br/>postgres_db")]

        FRONT --> BACK
        BACK --> PY
        BACK --> DB
    end

    RENDER --> FRONT
```

### Modelo inicial de base de datos.

```mermaid
erDiagram

    USUARIO {
        int ID PK
        string correo UK
        string contrasena_hash
        string rol
        string estado
    }

    JUEGO {
        int ID PK
        string nivel
        string categoria
        string nombre
    }

    INTERACCION_ESTUDIANTE {
        int ID PK
        int usuarioId FK
        int juegoId FK
        int puntaje
        int errores_comunes
        datetime fecha
    }

    PUBLICACION_FORO {
        int ID PK
        int usuarioId FK
        string contenido
        string estado
        datetime fecha_creacion
    }

    RESTRICCION {
        int ID PK
        int usuarioID FK
        datetime fecha_inicio
        datetime fecha_fin
        string nota_admin
    }

    USUARIO ||--o{ PUBLICACION_FORO : realiza
    USUARIO ||--o{ RESTRICCION : recibe
    USUARIO ||--o{ INTERACCION_ESTUDIANTE : registra
    JUEGO ||--o{ INTERACCION_ESTUDIANTE : genera
```

### Descripción del flujo entre frontend, NestJS, Python y PostgreSQL.

```mermaid
sequenceDiagram
    autonumber

    actor U as Usuario
    participant F as Frontend<br/>Ionic + Angular
    participant N as Backend<br/>NestJS
    participant DB as PostgreSQL<br/>Prisma ORM
    participant P as Microservicio<br/>Python + FastAPI

    U->>F: Interactúa con formulario o actividad

    F->>N: POST / GET<br/>HTTP + JSON

    Note over F,N: El frontend solo conoce<br/>la API principal de NestJS

    N->>N: ValidationPipe + DTOs<br/>Validación de datos

    N->>N: Autenticación JWT<br/>Roles y reglas de negocio

    N->>DB: Consulta mediante PrismaService<br/>Usuario, estado, restricciones, etc.
    DB-->>N: Datos persistidos

    alt Requiere procesamiento especializado

        N->>P: HTTP interno<br/>PYTHON_SERVICE_URL:8000

        Note over N,P: Comunicación interna<br/>con timeout

        P->>P: Analiza respuestas<br/>y patrones de error

        P->>P: Genera retroalimentación<br/>pedagógica

        P-->>N: Resultado estructurado

    else FastAPI no responde

        P--xN: Timeout / error de servicio
        N->>N: Captura la excepción<br/>y aplica degradación controlada

    end

    N->>DB: Guarda InteraccionEstudiante<br/>puntaje + errores_comunes
    DB-->>N: Persistencia confirmada

    N-->>F: 200 OK / 201 Created<br/>JSON procesado

    F->>F: Actualiza estado y componentes Ionic
    F-->>U: Muestra resultado y retroalimentación
```

### Registro inicial de decisiones arquitectónicas.

Este registro documenta las decisiones técnicas fundamentales tomadas para el diseño y desarrollo de Miracle, asegurando el cumplimiento de los requerimientos funcionales y no funcionales del proyecto.

#### Elección del Stack Frontend Multiplataforma

* **Contexto:** Se requiere que la aplicación sea accesible vía navegador web, PWA y aplicación nativa Android, manteniendo una única base de código.

* **Decisión:** Se utilizará **Angular** como framework principal, integrado con **Ionic** para los componentes de interfaz y **Capacitor** como puente de integración móvil.


#### Separación del Backend en Servicios Especializados (NestJS + FastAPI)

* **Contexto:** El sistema debe manejar lógica de negocio tradicional (usuarios, seguridad, foro) e implementar una capacidad adaptativa basada en el procesamiento de información externa.

* **Decisión:** Se adopta una arquitectura de servicios dividida. **NestJS (Node.js)** actuará como la API REST principal y barrera de seguridad (autenticación y autorización). Las tareas complejas de procesamiento de lenguaje, obtención de datos web y evaluación inteligente se delegan a un microservicio en **Python con FastAPI**.


#### Persistencia Relacional y Mapeo Objeto-Relacional (ORM)

* **Contexto:** Los datos del sistema (usuarios, restricciones, interacciones, foros) poseen un alto grado de relación y requieren validaciones estrictas de integridad.

* **Decisión:** Se implementará **PostgreSQL** como motor de base de datos principal, interactuando con él mediante **Prisma ORM**.


#### ADR-004: Contenerización y Orquestación Local

* **Contexto:** Es necesario garantizar que la arquitectura funcione de manera idéntica y aislada en los equipos de todos los desarrolladores y en el entorno final de despliegue.

* **Decisión:** Se contenerizará cada componente de la arquitectura (Frontend, NestJS, FastAPI, PostgreSQL) en imágenes **Docker** independientes, orquestadas localmente mediante **Docker Compose**.

## Variables de Entorno Requeridas

El proyecto utiliza variables de entorno para configurar la comunicación entre los servicios y las credenciales de desarrollo.

#### Backend NestJS

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Cadena de conexión utilizada por Prisma para acceder a PostgreSQL. | `postgresql://usuario:password@postgres-db:5432/miracle` |
| `JWT_SECRET` | Clave utilizada para firmar y validar tokens JWT. | `clave_desarrollo` |
| `PYTHON_SERVICE_URL` | Dirección interna del microservicio FastAPI. | `http://python-service:8000` |

#### PostgreSQL

| Variable | Descripción | Ejemplo |
|---|---|---|
| `POSTGRES_USER` | Usuario de PostgreSQL. | `miracle` |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL. | `miracle_password` |
| `POSTGRES_DB` | Nombre de la base de datos principal. | `miracle_db` |

#### GitHub Actions / Staging

| Variable / Secret | Descripción |
|---|---|
| `RENDER_DEPLOY_HOOK_URL` | Secret de GitHub Actions que contiene el Deploy Hook utilizado para activar el despliegue del ambiente de staging en Render. |
