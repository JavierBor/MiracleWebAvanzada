# Miracle

**Descripción breve:** Miracle consiste en una aplicación web interactiva y multiplataforma diseñada para apoyar el proceso de aprendizaje de inglés de los estudiantes de la PUCV mediante ejercicios lúdicos y adaptativos.
docker-compose up --builddocker-compose up --build
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

# Entrega parcial 2 Miracle

## Arquitectura y Robustez del Frontend (Angular + Ionic) (EP2 - Punto 1)

El cliente frontend (`/Frontend`) no es una interfaz básica; está desarrollado sobre Angular e Ionic Framework, ofreciendo una arquitectura multiplataforma híbrida (Web y Móvil) de alta escalabilidad:

* **Componentización Modular**: Estructura basada en módulos independientes para autenticación, gestión comunitaria (foro), sistema de vocabulario y componentes adaptativos.
* **Seguridad e Intercepción (HttpInterceptor)**: Gestión centralizada de tokens JWT para inyección automática en las cabeceras HTTP, garantizando comunicación segura y validada con el backend NestJS.
* **Diseño Responsivo y Experiencia de Usuario (UI/UX)**: Interfaces construidas con componentes nativos de Ionic, optimizados para adaptar su visualización dinámicamente entre dispositivos móviles y vistas de escritorio.

## Estrategia de Gestión de Datos de Vocabulario (EP2 - Punto 3)

Para garantizar la calidad de los datos del juego de vocabulario y la estabilidad del sistema, se implementó un pipeline robusto de extracción, transformación y persistencia en el backend (NestJS + PostgreSQL):

* **Extracción Automatizada:** El servicio se conecta a un microservicio en Python (vía FastAPI) que extrae definiciones, audios y fonética (A1 - Inglés I) desde fuentes externas (Datamuse/MyMemory).
* **Validación y Limpieza:** Antes de procesar cualquier respuesta, se valida la integridad estructural de los datos recibidos (evitando registros corruptos o incompletos). Posteriormente, se limpian los strings con `.trim()` para eliminar espacios en blanco innecesarios.
* **Normalización:** Las palabras clave se transforman a minúsculas (`toLowerCase()`) y se asignan valores por defecto robustos a campos faltantes (ej. `categoria_gramatical = 'unknown'`) para estandarizar la base de datos local.
* **Deduplicación Activa:** Se implementó una "memoria" bidireccional. El frontend envía un historial de palabras ya jugadas (`usadas[]`), y el backend cruza tanto las palabras clave como sus *definiciones* en PostgreSQL. Si detecta un choque conceptual, extrae automáticamente una alternativa aleatoria desde la base de datos local, garantizando rondas 100% únicas.
* **Trazabilidad:** Se incorporó el campo `fecha_recuperacion` en el esquema de Prisma para auditar el momento exacto de ingreso o actualización de cada registro en la base de datos.
* **Manejo de Errores e Indisponibilidad:** Se configuró un límite estricto de tiempo (*Timeout* de 5 segundos) usando `AbortController`. Si el microservicio Python no responde a tiempo o devuelve errores (404, 502), el backend lanza excepciones HTTP controladas (como 504 Gateway Timeout), evitando bloqueos en cadena y caídas del servidor principal.
* **Estrategia de Actualización (Caché y Upsert):** El sistema prioriza lecturas locales (Cache Hit). Sin embargo, verifica la "frescura" de los datos: si un registro no ha sido actualizado en los últimos 30 días, el backend lo marca como obsoleto, vuelve a consultar la API externa y aplica un comando `upsert` en Prisma para refrescar la información existente o crearla si no existía.

## Integración del Servicio Python (EP2 - Punto 4)

Para cumplir con los requisitos de integración, el microservicio se ha desarrollado asegurando estrictamente los siguientes puntos:

* **Procesamiento no trivial implementado mediante FastAPI:** El servicio asíncrono no actúa como un simple puente de red; orquesta y procesa datos de múltiples fuentes (Datamuse y MyMemory), extrayendo, separando y fusionando definiciones, fonética y traducciones para adaptar el contenido al nivel de Inglés I.
* **Endpoints documentados:** La API genera automáticamente su documentación interactiva bajo el estándar OpenAPI (disponible en `/docs`), incluyendo resumen (`summary`), descripción detallada y el mapeo de todos los posibles códigos de respuesta HTTP.
* **Contratos de entrada y salida:** Se definieron esquemas estrictos de respuesta utilizando `Pydantic` (clase `DefinicionLimpia` heredada de `BaseModel`), garantizando que la estructura de los datos que viajan hacia NestJS sea tipada y predecible.
* **Validación de solicitudes y respuestas:** Las peticiones entrantes son inspeccionadas antes de su ejecución mediante expresiones regulares (`^[a-zA-Z]+$`) en los parámetros de ruta (`Path`). Se rechazan automáticamente cadenas con números o símbolos mediante un código 422 (Unprocessable Entity).
* **Integración funcional con NestJS:** El backend principal (NestJS) consume el endpoint de Python de manera exitosa, parseando el contrato JSON estructurado e insertando la información limpia directamente en la base de datos PostgreSQL.
* **Pruebas automatizadas:** Se implementó una suite de pruebas utilizando `pytest` y `TestClient` que verifica la salud del sistema, el procesamiento exitoso de palabras válidas, el rechazo de peticiones inválidas (422) y el manejo de palabras inexistentes (404).
* **Manejo de errores:** Se implementaron bloques `try/except` para capturar cualquier fallo interno o de dependencias, informando al servicio principal (NestJS) mediante excepciones HTTP limpias (ej. 404 Not Found, 502 Bad Gateway).
* **Control de tiempos de espera:** Las peticiones asíncronas hacia las APIs externas (Datamuse) cuentan con un límite estricto (`timeout` de 3.5 segundos en `httpx`), evitando bloquear el hilo principal y asegurando respuestas rápidas.
* **Manejo de indisponibilidad del servicio:** Si la fuente externa o el propio microservicio tardan demasiado o fallan, el sistema lanza excepciones controladas (ej. 504 Gateway Timeout o 503 Service Unavailable), permitiendo que NestJS las intercepte y mantenga la aplicación estable sin bloqueos en cadena.

## (EP2 - Punto 5)

## Recolección y recuperación de información (motor de búsqueda) (EP2 - Punto 6)

Se implementó un motor de búsqueda inteligente (Information Retrieval) para el Foro de Consultas de la aplicación Miracle, siguiendo la arquitectura de 3 capas:

• Microservicio Python (FastAPI):
  - Corpus y Normalización: Recibe las publicaciones del foro y limpia la consulta (conversión a minúsculas, remoción de stopwords en inglés y español).
  - Índice TF-IDF y Ranking: Utiliza TfidfVectorizer de scikit-learn y calcula la Similitud del Coseno (cosine_similarity) para asignar una puntuación de relevancia (score de 0.0 a 1.0) a cada documento.
  - Metadatos: Retorna los resultados ordenados por relevancia junto con el tiempo exacto de procesamiento en milisegundos (processing_time_ms).

• Backend Principal (NestJS):
  - Extrae el corpus desde PostgreSQL mediante Prisma ORM.
  - Envía la consulta y el corpus a FastAPI mediante peticiones HTTP internas.
  - Resiliencia: Incorpora un Timeout estricto de 5 segundos con interrupción controlada para evitar bloqueos si Python no responde.

• Frontend Multiplataforma (Angular/Ionic):
  - Interfaz gráfica con barra de búsqueda que presenta las publicaciones filtradas, el porcentaje de relevancia (%) y el tiempo de respuesta.

## Evaluación de la Información Recuperada (EP2 - Punto 7)

Se implementó una estrategia de evaluación cuantitativa sobre el motor de búsqueda del foro para medir la precisión del algoritmo de Recuperación de Información (TF-IDF + Similitud del Coseno) y el desempeño del microservicio Python.

### Métricas Seleccionadas
1. **Precision@K (Precision@3):** Evalúa la proporción de publicaciones relevantes recuperadas dentro de los primeros 3 resultados entregados por el sistema.
2. **Tiempo de Latencia Promedio (ms):** Mide el tiempo invertido en la tokenización, vectorización TF-IDF y cálculo del ranking matricial.
3. **Porcentaje de Registros Válidos:** Mide la tasa de éxito de las peticiones sin errores de ejecución o fallos de esquema.

### Resultados Cuantitativos Obtenidos

| Métrica | Valor Medido | Criterio de Aprobación | Estado |
| :--- | :--- | :--- | :--- |
| **Precision@3** | 0.8333 (83.3%) | > 70.0% | Cumplido |
| **Latencia Promedio** | 12.45 ms | < 500 ms | Cumplido |
| **Registros Válidos** | 100% | > 95.0% | Cumplido |

### Análisis de Resultados y Limitaciones
* **Desempeño:** El procesamiento vectorial en FastAPI responde en menos de 20 ms para el conjunto de pruebas, garantizando una baja latencia en la integración con NestJS.
* **Limitaciones:** Al basarse en la frecuencia de términos (TF-IDF), el motor depende de la coincidencia léxica directa; no captura relaciones semánticas complejas si el estudiante utiliza sinónimos que no estén presentes en el cuerpo de la publicación.

### Pruebas automatizadas y devsecops
--------------------------------------------------------------------------------
• Cobertura mediante suite de pruebas unitarias en Python (pytest) ejecutadas en el contenedor Docker.
• 9 de 9 pruebas exitosas (100% PASSED):
  - Verificación del endpoint de salud (/health).
  - Contrato de vocabulario y validaciones de Pydantic (HTTP 422 y 404).
  - Motor de búsqueda TF-IDF y casos borde del foro (corpus vacío, stopwords).
  - Evaluación cuantitativa de Precision@3 y métricas de latencia.


## Diseño Preliminar de la Capacidad Adaptativa (EP2 - Punto 8)

Para el Módulo 3, el sistema "MiracleWebAvanzada" implementará un motor inteligente basado en el Ajuste Dinámico de Dificultad (DDA) dentro de sus mecánicas de juego. A continuación se define su especificación preliminar:

*   **¿Qué parte del sistema se adaptará?:** La dificultad gramatical de las palabras consultadas en tiempo real durante los minijuegos. El caso de uso principal será el "Verb Transformer", donde el usuario debe conjugar verbos al *Past Simple*.
*   **¿Quién será el usuario beneficiado?:** El estudiante, proporcionándole un desafío progresivo que lo mantenga en estado de "flujo" (evitando el aburrimiento) y penalice los errores para fomentar la retención y concentración.
*   **¿Qué información recuperada desde la Web será utilizada?:** Un corpus masivo de verbos extraído de **Datamuse API** (necesaria para obtener las palabras, filtrar algorítmicamente su categoría gramatical y determinar su frecuencia de uso) y **MyMemory API** (necesaria para automatizar la traducción contextual al español). Esta automatización es indispensable para escalar el diccionario sin depender de ingresos manuales estáticos.
*   **¿Qué variables de usuario o contexto podrían considerarse?:** La "racha" (streak) en vivo de respuestas correctas consecutivas del usuario dentro de la sesión de juego activa.
*   **¿Qué decisión deberá tomar el sistema?:** Cambiar algorítmicamente la complejidad morfológica del verbo a consultar. 
    * **Racha Baja (Fácil):** El sistema inyecta verbos regulares (ej. *Play -> Played*).
    * **Racha Media (Medio):** El sistema inyecta verbos irregulares de uso cotidiano (ej. *Go -> Went*).
    * **Racha Alta (Difícil):** El sistema inyecta verbos irregulares complejos o invariables (ej. *Broadcast -> Broadcast*).
    * Si el usuario comete un error, la racha se rompe y la dificultad se reinicia a Fácil.
*   **¿Qué resultado deberá ser visible para el usuario?:** Un incremento notable en la complejidad de los verbos a transformar a medida que mantiene su racha de aciertos, y una evidente caída a verbos regulares sencillos al equivocarse y perder su progreso.
*   **¿Qué mecanismo podría emplearse?:** Un motor basado en políticas y reglas de estado evaluadas desde el backend (NestJS), que actúe como un selector dinámico de dificultad sobre la base de datos PostgreSQL.
*   **¿Cómo podría evaluarse posteriormente la utilidad de la adaptación?:** Se comparará la métrica de la "racha máxima conseguida" en la sesión actual versus la "mejor racha histórica" del estudiante, midiendo si el riesgo de volver a cero y la progresión dinámica fomentan una mayor tasa de éxito ("engagement") que jugar con una dificultad estática o aleatoria.

## Actualización del Pipeline DevSecOps (EP2 - Punto 9)
El proyecto cuenta con una canalización automatizada mediante GitHub Actions (`.github/workflows/pipeline.yml`), gestionando la configuración mediante *GitHub Actions Variables* y credenciales mediante *GitHub Actions Secrets*. El flujo integra:
* **Pruebas y Calidad**: Ejecución de pruebas unitarias del servicio Python (`pytest`), pruebas de integración NestJS-FastAPI, pruebas del motor de recuperación de información, y linting de código Python (`flake8`).
* **Análisis Estático y Dependencias (SAST)**: Detección de código inseguro con Bandit y análisis de dependencias vulnerables de Python con Safety.
* **Detección de Secretos**: Uso de TruffleHog para evitar la exposición accidental de llaves o tokens en los repositorios.
* **Seguridad de Contenedores e IaC**: Análisis de vulnerabilidades en las imágenes Docker de los tres servicios usando Trivy (apoyado en `.trivyignore`), y validación del código de infraestructura de Terraform (`fmt`, `validate`, `plan`).
* **Despliegue y Salud**: Despliegue automatizado hacia el ambiente de staging mediante webhooks, seguido de pruebas de salud post-despliegue automáticas.

## Observabilidad Inicial (EP2 - Punto 10)
Para garantizar la trazabilidad y la resiliencia del sistema, se han integrado métricas y controles de salud en cada capa:
* **Endpoints de Salud (`/health`)**: Ambos servicios (NestJS y FastAPI) exponen puntos de control para reportar su estado operativo.
* **Verificación de Conexión (PostgreSQL)**: Integración de `pg_isready` en los *healthchecks* de Docker Compose, asegurando que NestJS y FastAPI solo reciban tráfico cuando la base de datos esté lista.
* **Métrica de Tiempo de Respuesta**: Implementación de un middleware en FastAPI y un interceptor global en NestJS (`LoggingInterceptor`) que calculan la latencia de procesamiento e inyectan el encabezado `X-Response-Time` en milisegundos.
* **Registros Estructurados y Errores**: Logueo de solicitudes HTTP en consola con sus respectivos códigos de estado, incluyendo la captura controlada de errores de las fuentes externas (Datamuse/MyMemory) mediante bloques `try/catch` que evitan caídas del servicio y generan registros claros.

## Documentación Actualizada (EP2 - Punto 11)

### Documentación de APIs
* **NestJS (Backend Principal)**: La documentación interactiva bajo el estándar OpenAPI (Swagger) se encuentra autogenerada y accesible en la ruta `/api` al levantar el servicio.
* **FastAPI (Microservicio)**: Los endpoints, esquemas de Pydantic y códigos de error documentados se exponen automáticamente en la ruta `/docs`.

### Instrucciones de Despliegue en Staging
El despliegue en staging está completamente automatizado a través del pipeline DevSecOps. 
1. Cualquier *push* o *merge* hacia la rama `main` gatilla el flujo en GitHub Actions.
2. Tras superar exitosamente las etapas de pruebas, linting y seguridad, el *Job 3* ejecuta una petición POST hacia el webhook configurado en el secreto `RENDER_DEPLOY_HOOK_URL`.
3. Esto instruye a la plataforma cloud a extraer la última versión del repositorio, compilar los contenedores y desplegar la versión funcional sin intervención manual.
