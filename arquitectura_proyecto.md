# 🏫 Helen School — Arquitectura del Proyecto

## 📐 Diagrama de Flujo General

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NAVEGADOR (Usuario)                          │
│                                                                     │
│   Angular (localhost:4200)        Spring MVC (localhost:8080)       │
│   ┌──────────────────────┐        ┌─────────────────────────────┐  │
│   │  Frontend Angular    │◄──────►│  Backend Spring Boot        │  │
│   │  (API REST / JSON)   │        │  (Thymeleaf + REST API)     │  │
│   └──────────────────────┘        └─────────────────────────────┘  │
│                                            │                        │
│                                   ┌────────▼────────┐              │
│                                   │  MySQL Database  │              │
│                                   │  (Helen_School)  │              │
│                                   └─────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ BASE DE DATOS — `Helen_School`

| Tabla      | Campos principales                                                          | Descripción                        |
|------------|-----------------------------------------------------------------------------|------------------------------------|
| `alumno`   | `id_alumno`, `nombres`, `apellidos`, `dni`, `fecha_nacimiento`, `id_grado`, `id_tutor` | Datos del estudiante  |
| `tutor`    | `id_tutor`, `nombres`, `apellidos`, `dni`, `telefono`, `email`, `direccion`, `parentesco` | Apoderado del alumno |
| `grado`    | `id`, `nombre`, `seccion`, `profesor_encargado`                            | Grado y sección escolar            |
| `usuario`  | `idusuario`, `nombres`, `apellidos`, `username`, `clave`, `idrol`          | Usuarios del sistema               |
| `rol`      | `idrol`, `nombre`                                                           | Roles (Auxiliar, Directora)        |

### Relaciones
```
alumno ──► grado    (FK: id_grado)
alumno ──► tutor    (FK: id_tutor)
usuario ──► rol     (FK: idrol)
```

**Script:** [bdProyectoDAW1.sql](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/bdProyectoDAW1.sql)

---

## ⚙️ BACKEND — Spring Boot (`colegio/`)

> Puerto: **8080** | Tecnología: **Java + Spring Boot + JPA + MySQL**

### 📁 Estructura de Capas

```
src/main/java/com/cibertec/colegio/
├── ColegioApplication.java       ← Punto de entrada
├── config/
│   ├── SecurityConfig.java       ← Seguridad y autenticación
│   └── DataInitializer.java      ← Carga inicial de datos
├── model/                        ← Entidades JPA (tablas)
├── repository/                   ← Acceso a base de datos
├── service/                      ← Lógica de negocio
│   └── impl/                     ← Implementaciones
├── controller/                   ← Endpoints HTTP
└── messaging/                    ← Kafka (mensajería)
```

---

### 🏗️ CAPA MODEL — Entidades de Base de Datos

| Archivo | Tabla BD | Campos |
|---------|----------|--------|
| [Alumno.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/model/Alumno.java) | `alumno` | id, nombres, apellidos, dni, fechaNacimiento, grado, tutor |
| [Tutor.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/model/Tutor.java) | `tutor` | id, nombres, apellidos, dni, telefono, email, direccion, parentesco |
| [Grado.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/model/Grado.java) | `grado` | id, nombre, seccion, profesorEncargado |
| [Usuario.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/model/Usuario.java) | `usuario` | id, nombres, apellidos, username, clave, rol |
| [Rol.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/model/Rol.java) | `rol` | id, nombre |

---

### 🗃️ CAPA REPOSITORY — Acceso a Datos (JPA)

| Archivo | Extiende | Función |
|---------|----------|---------|
| [AlumnoRepository.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/repository/AlumnoRepository.java) | `JpaRepository<Alumno>` | CRUD de alumnos |
| [TutorRepository.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/repository/TutorRepository.java) | `JpaRepository<Tutor>` | CRUD de tutores |
| [GradoRepository.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/repository/GradoRepository.java) | `JpaRepository<Grado>` | CRUD de grados |
| [UsuarioRepository.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/repository/UsuarioRepository.java) | `JpaRepository<Usuario>` | CRUD + búsqueda por username |
| [RolRepository.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/repository/RolRepository.java) | `JpaRepository<Rol>` | CRUD de roles |

> Los repositorios heredan automáticamente los métodos: `findAll()`, `findById()`, `save()`, `deleteById()` de Spring Data JPA.

---

### 🔧 CAPA SERVICE — Lógica de Negocio

| Archivo (Interfaz) | Implementación | Función |
|--------------------|---------------|---------|
| [AlumnoService.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/service/AlumnoService.java) | *(directa)* | Listar, guardar, buscar, eliminar alumnos |
| [TutorService.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/service/TutorService.java) | *(directa)* | Listar, guardar, buscar, eliminar tutores |
| [GradoService.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/service/GradoService.java) | *(directa)* | Listar, guardar, buscar, eliminar grados |
| [UsuarioService.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/service/UsuarioService.java) | [UsuarioServiceImpl.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/service/impl/UsuarioServiceImpl.java) | Gestión de usuarios + encriptación BCrypt |
| [RolService.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/service/RolService.java) | [RolServiceImpl.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/service/impl/RolServiceImpl.java) | Listar roles |
| [ReporteService.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/service/ReporteService.java) | *(directa)* | Generación de reportes Excel/PDF |
| [UsuarioDetailsServiceImpl.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/service/impl/UsuarioDetailsServiceImpl.java) | — | Autenticación con Spring Security |

---

### 🌐 CAPA CONTROLLER — Endpoints HTTP

#### Controladores Web (Thymeleaf — vistas HTML)

| Archivo | Ruta base | Vistas que sirve |
|---------|-----------|-----------------|
| [AlumnoRestController.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/controller/AlumnoRestController.java) | `/alumnos` | `templates/alumnos/index.html` |
| [TutorRestController.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/controller/TutorRestController.java) | `/tutores` | `templates/tutores/index.html` |
| [GradoRestController.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/controller/GradoRestController.java) | `/grados` | `templates/grados/index.html` |
| [MatriculaController.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/controller/MatriculaController.java) | `/matricula` | `templates/matricula.html`, `nueva-matricula.html` |
| [UsuarioRestController.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/controller/UsuarioRestController.java) | `/usuario` | `templates/usuario/index.html`, `registrar.html` |
| [ReporteController.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/controller/ReporteController.java) | `/reportes` | `templates/reportes/index.html` |

#### Controladores REST (JSON — para el Frontend Angular)

| Archivo | Ruta base | Métodos expuestos |
|---------|-----------|------------------|
| [MatriculaRestController.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/controller/MatriculaRestController.java) | `/api/alumno` | GET, POST, PUT, DELETE matrícula |
| [ReporteRestController.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/controller/ReporteRestController.java) | `/api/reporte` | GET estadísticas y reportes |

> **Nota:** Los controladores REST son los que consumen las vistas de Angular. Los controladores web sirven las páginas Thymeleaf directamente.

#### Endpoints REST disponibles

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/alumno` | Listar todos los alumnos |
| POST | `/api/alumno` | Registrar nuevo alumno |
| PUT | `/api/alumno/{id}` | Actualizar alumno |
| DELETE | `/api/alumno/{id}` | Eliminar alumno |
| GET | `/api/grado` | Listar todos los grados |
| POST | `/api/grado` | Registrar grado |
| PUT | `/api/grado/{id}` | Actualizar grado |
| DELETE | `/api/grado/{id}` | Eliminar grado |
| GET | `/api/tutor` | Listar tutores |
| POST | `/api/tutor` | Registrar tutor |
| PUT | `/api/tutor/{id}` | Actualizar tutor |
| DELETE | `/api/tutor/{id}` | Eliminar tutor |

---

### 🔐 CONFIG — Seguridad e Inicialización

| Archivo | Función |
|---------|---------|
| [SecurityConfig.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/config/SecurityConfig.java) | Define qué rutas requieren autenticación, configura Spring Security, CORS para Angular |
| [DataInitializer.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/config/DataInitializer.java) | Se ejecuta al iniciar: encripta contraseñas existentes con BCrypt |
| [application.properties](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/application.properties) | Configuración de BD, puerto, JPA, seguridad |

---

### 📨 MESSAGING — Kafka (Mensajería Asíncrona)

| Archivo | Función |
|---------|---------|
| [MatriculaKafkaProducer.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/messaging/MatriculaKafkaProducer.java) | Envía mensajes Kafka al registrar una matrícula |
| [MatriculaKafkaConsumer.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/messaging/MatriculaKafkaConsumer.java) | Recibe y procesa mensajes Kafka de matrículas |
| [AlumnoListener.java](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/java/com/cibertec/colegio/messaging/AlumnoListener.java) | Escucha eventos relacionados a alumnos |

---

### 🖼️ TEMPLATES — Vistas Thymeleaf (HTML del Backend)

| Archivo | URL de acceso | Descripción |
|---------|---------------|-------------|
| [login.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/login.html) | `/login` | Pantalla de inicio de sesión |
| [menu.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/menu.html) | `/menu` | Menú principal del sistema |
| [alumnos/index.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/alumnos/index.html) | `/alumnos` | Gestión de alumnos (MVC) |
| [tutores/index.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/tutores/index.html) | `/tutores` | Gestión de tutores (MVC) |
| [grados/index.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/grados/index.html) | `/grados` | Gestión de grados (MVC) |
| [matricula.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/matricula.html) | `/matricula` | Lista de matrículas |
| [nueva-matricula.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/nueva-matricula.html) | `/nueva-matricula` | Formulario nueva matrícula |
| [registrar.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/registrar.html) | `/registrar` | Registro de usuarios |
| [usuario/index.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/usuario/index.html) | `/usuario` | Gestión de usuarios |
| [reportes/index.html](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/colegio/src/main/resources/templates/reportes/index.html) | `/reportes` | Reportes y estadísticas |

---

## 🅰️ FRONTEND — Angular (`frontend-colegio/`)

> Puerto: **4200** | Tecnología: **Angular 20 + TypeScript + RxJS**

### 📁 Estructura de Archivos

```
src/app/
├── app.component.ts          ← Componente raíz (navbar + layout)
├── app.component.css         ← Estilos globales del layout
├── app-routing.module.ts     ← Definición de rutas Angular
├── datos.service.ts          ← Servicios HTTP (conexión al backend)
│
├── home/                     ← Página de inicio
├── dashboard/                ← Panel resumen
├── alumno/                   ← Módulo de alumnos
├── tutor/                    ← Módulo de tutores
├── grado/                    ← Módulo de grados
└── matriculas/               ← Módulo de matrículas
```

---

### 🔗 RUTAS ANGULAR

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | `HomeComponent` | Página de bienvenida |
| `/dashboard` | `DashboardComponent` | Panel de resumen |
| `/alumno` | `AlumnoComponent` | CRUD de alumnos |
| `/tutor` | `TutorComponent` | CRUD de tutores |
| `/grado` | `GradoComponent` | CRUD de grados |
| `/matriculas` | `MatriculasComponent` | Gestión de matrículas |

**Archivo de rutas:** [app-routing.module.ts](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/frontend-colegio/src/app/app-routing.module.ts)

---

### 📦 COMPONENTES ANGULAR

| Carpeta | Archivos | Función |
|---------|----------|---------|
| `home/` | `home.component.ts/.html/.css` | Landing page con presentación del sistema |
| `dashboard/` | `dashboard.component.ts/.html` | Resumen general del sistema |
| `alumno/` | `alumno.component.ts/.html/.css` + `datos.ts` | CRUD completo de alumnos |
| `tutor/` | `tutor.component.ts/.html/.css` + `datos.ts` | CRUD completo de tutores |
| `grado/` | `grado.component.ts/.html/.css` + `datos.ts` | CRUD completo de grados |
| `matriculas/` | `matriculas.component.ts/.html/.css` + `datos.ts` | Gestión de matrículas |

### Interfaces de Datos (`datos.ts`)

Cada módulo tiene su propio `datos.ts` que define la forma del objeto:

| Archivo | Modelo | Campos |
|---------|--------|--------|
| [alumno/datos.ts](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/frontend-colegio/src/app/alumno/datos.ts) | `Datos` | id, nombres, apellidos, dni, fechaNacimiento, grado, tutor |
| [tutor/datos.ts](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/frontend-colegio/src/app/tutor/datos.ts) | `Datos` | id, nombres, apellidos, dni, telefono, email, etc. |
| [grado/datos.ts](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/frontend-colegio/src/app/grado/datos.ts) | `Datos` | id, nombre, seccion |
| [matriculas/datos.ts](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/frontend-colegio/src/app/matriculas/datos.ts) | `Datos` | alumno + grado + tutor combinados |

---

### 🔌 SERVICIO DE CONEXIÓN AL BACKEND

**Archivo:** [datos.service.ts](file:///d:/CIBERTEC/6toCiclo/Modulo02/DESARROLLO%20DE%20SERVICIOS%20WEB%20II/EVALUACIONES/PROYECTO/Proyecto%20DSW%202/frontend-colegio/src/app/datos.service.ts)

> URL base de la API: `http://localhost:8080/api`

| Clase de Servicio | Entidad | Métodos disponibles |
|------------------|---------|---------------------|
| `DatosService` | Alumno | `getDatos()`, `crearAlumno()`, `actualizarAlumno()`, `eliminarAlumno()` |
| `DatosServicegrado` | Grado | `getDatos()`, `crearGrado()`, `actualizarGrado()`, `eliminarGrado()` |
| `DatosServicetutor` | Tutor | `getDatos()`, `crearTutor()`, `actualizarTutor()`, `eliminarTutor()` |
| `DatosServiceMatricula` | Matrícula | `getMatriculas()`, `crearMatricula()`, `actualizarMatricula()` |

---

## 🔄 FLUJO COMPLETO POR ACCIÓN

### Ejemplo: El usuario crea un alumno en Angular

```
1. Usuario llena el formulario en alumno.component.html (localhost:4200/alumno)
        │
        ▼
2. alumno.component.ts llama a DatosService.crearAlumno(alumno)
        │
        ▼
3. DatosService hace POST http://localhost:8080/api/alumno con JSON
        │
        ▼  (HTTP + CORS)
4. MatriculaRestController.java recibe la petición en el backend
        │
        ▼
5. AlumnoService.java procesa la lógica de negocio
        │
        ▼
6. AlumnoRepository.java ejecuta INSERT en MySQL tabla 'alumno'
        │
        ▼
7. Respuesta JSON regresa al componente Angular
        │
        ▼
8. La tabla en pantalla se actualiza automáticamente
```

---

## 📊 RESUMEN GLOBAL DE ARCHIVOS

| Capa | Cantidad de archivos | Tecnología |
|------|---------------------|------------|
| Modelos (BD) | 5 `.java` | JPA / Hibernate |
| Repositorios | 5 `.java` | Spring Data JPA |
| Servicios | 9 `.java` | Spring Service |
| Controladores MVC | 6 `.java` | Spring MVC + Thymeleaf |
| Controladores REST | 2 `.java` | Spring REST |
| Config / Seguridad | 2 `.java` | Spring Security |
| Messaging (Kafka) | 3 `.java` | Apache Kafka |
| Templates HTML (backend) | 10 `.html` | Thymeleaf |
| Componentes Angular | 6 módulos | Angular 20 |
| Servicios Angular | 1 `.ts` (4 clases) | HttpClient / RxJS |
| Interfaces de datos | 4 `datos.ts` | TypeScript |
