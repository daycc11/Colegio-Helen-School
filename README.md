# 📖 Documentación Técnica — Sistema Helen School

## Descripción General

**Helen School** es un sistema de gestión académica para un colegio. Permite administrar estudiantes, docentes, tutores, grados, matrículas y pagos desde una interfaz web moderna. Está construido con una arquitectura cliente-servidor desacoplada.

---

## Tecnologías Utilizadas

### Backend
| Tecnología | Versión | Rol |
|---|---|---|
| **Java** | 17 | Lenguaje principal del backend |
| **Spring Boot** | 3.5.5 | Framework principal del servidor |
| **Spring Data JPA** | Incluido | Acceso a base de datos con Hibernate |
| **Spring Security** | Incluido | Autenticación y protección de rutas |
| **Hibernate** | 6.6 | ORM (mapeo objeto-relacional) |
| **PostgreSQL Driver** | 42.7.7 | Conector a la base de datos |
| **HikariCP** | Incluido | Pool de conexiones a la BD |
| **Lombok** | Incluido | Reduce código repetitivo (getters/setters) |
| **Apache POI** | 5.2.4 | Generación de reportes Excel |
| **Selenium Java** | 4.21.0 | Pruebas automatizadas de UI |
| **JUnit 5** | Incluido | Framework de pruebas unitarias |
| **Mockito** | Incluido | Mocks para pruebas unitarias |
| **Maven** | 3.9 | Gestión de dependencias y compilación |

### Frontend
| Tecnología | Versión | Rol |
|---|---|---|
| **Angular** | 17+ | Framework principal del frontend |
| **TypeScript** | 5+ | Lenguaje del frontend |
| **HTML5 / CSS3** | — | Estructura y estilos |
| **Vanilla CSS** | — | Sistema de diseño neomórfico propio |
| **Google Fonts** | — | Tipografía: Plus Jakarta Sans |
| **Material Symbols** | — | Iconos de la interfaz |
| **RxJS** | Incluido | Programación reactiva / HTTP calls |
| **Angular Router** | Incluido | Navegación SPA |
| **HttpClient** | Incluido | Comunicación con el backend REST |

### Base de Datos e Infraestructura
| Tecnología | Rol |
|---|---|
| **PostgreSQL** | Motor de base de datos relacional |
| **Railway** | Plataforma cloud donde corre PostgreSQL |

---

## Arquitectura del Sistema

```
┌─────────────────────┐         HTTP / REST API          ┌──────────────────────┐
│   FRONTEND          │ ───────────────────────────────► │   BACKEND            │
│   Angular 17        │ ◄─────────────── JSON ────────── │   Spring Boot 3.5.5  │
│   localhost:4200    │       withCredentials: true       │   localhost:8080     │
└─────────────────────┘                                  └──────────┬───────────┘
                                                                     │
                                                                     │ JDBC / SSL
                                                                     ▼
                                                          ┌──────────────────────┐
                                                          │   POSTGRESQL         │
                                                          │   Railway Cloud      │
                                                          │   mainline.proxy.    │
                                                          │   rlwy.net:36438     │
                                                          └──────────────────────┘
```

---

## Estructura del Backend

```
colegio/src/main/java/com/cibertec/colegio/
│
├── ColegioApplication.java          ← Punto de entrada (main)
│
├── config/
│   ├── SecurityConfig.java          ← Configuración de Spring Security y CORS
│   └── RailwayDatabaseConfig.java   ← Parsea DATABASE_URL de Railway automáticamente
│
├── model/                           ← Entidades JPA (tablas de la BD)
│   ├── Alumno.java                  ← Estudiantes
│   ├── Grado.java                   ← Grados y secciones
│   ├── Tutor.java                   ← Apoderados/tutores
│   ├── Docente.java                 ← Docentes
│   ├── Pago.java                    ← Pagos de matrícula
│   ├── Usuario.java                 ← Usuarios del sistema
│   └── Rol.java                     ← Roles (Administrador, Auxiliar)
│
├── repository/                      ← Interfaces JPA (acceso a datos)
│   ├── AlumnoRepository.java
│   ├── GradoRepository.java
│   ├── TutorRepository.java
│   ├── DocenteRepository.java
│   ├── PagoRepository.java          ← Incluye query de alumnos sin pago
│   ├── UsuarioRepository.java
│   └── RolRepository.java
│
├── service/                         ← Lógica de negocio
│   ├── AlumnoService.java
│   ├── GradoService.java
│   ├── TutorService.java
│   ├── DocenteService.java
│   ├── PagoService.java
│   └── UsuarioDetailsServiceImpl.java ← Para Spring Security
│
└── controller/                      ← Endpoints REST
    ├── AlumnoRestController.java         → GET/POST/PUT/DELETE /api/alumnos
    ├── GradoRestController.java          → GET/POST/PUT/DELETE /api/grados
    ├── TutorRestController.java          → GET/POST/PUT/DELETE /api/tutores
    ├── DocenteRestController.java        → GET/POST/PUT/DELETE /api/docentes
    ├── MatriculaRestController.java  → GET/POST /api/matriculas
    ├── PagoRestController.java           → GET/POST/DELETE /api/pagos
    ├── ReporteRestController.java    → GET /api/reportes
    ├── AuthRestController.java       → POST /api/auth/login, logout
    └── UsuarioRestController.java    → GET/POST /api/usuarios
```

---

## Estructura del Frontend

```
frontend-colegio/src/app/
│
├── app.component.ts/html/css    ← Layout principal con sidebar y topbar
├── app-routing.module.ts        ← Definición de rutas (con authGuard)
├── datos.service.ts             ← Servicio HTTP central
│
├── auth/
│   ├── login/                   ← Pantalla de inicio de sesión
│   ├── registro/                ← Registro de usuarios
│   ├── auth.service.ts          ← Gestión de sesión y token
│   └── auth.guard.ts            ← Protección de rutas privadas
│
├── dashboard/                   ← Panel de control con estadísticas
├── alumno/                      ← CRUD de estudiantes
├── grado/                       ← CRUD de grados
├── tutor/                       ← CRUD de tutores
├── docente/                     ← CRUD de docentes
├── matriculas/                  ← Registro de matrículas
├── pago/                        ← Módulo de pagos (4 métodos)
│   ├── pago.component.ts/html/css
│   └── pago.model.ts            ← Interfaces TypeScript
└── reportes/                    ← Generación y descarga de reportes
```

---

## Modelo de Base de Datos

```
usuario ──────────── rol
   │
   └── (autenticación del sistema)

alumno ─────────── grado
   │  └────────── tutor
   │
   └── pago (1 alumno → muchos pagos)
         ├── metodoPago (Tarjeta/Transferencia/Yape/Efectivo)
         ├── monto
         ├── fechaPago
         └── estado (COMPLETADO/PENDIENTE)

docente (independiente)
```

---

## API REST — Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/logout` | Cerrar sesión |
| GET | `/api/alumnos` | Listar todos los alumnos |
| POST | `/api/alumnos` | Crear alumno |
| PUT | `/api/alumnos/{id}` | Actualizar alumno |
| DELETE | `/api/alumnos/{id}` | Eliminar alumno |
| GET | `/api/pagos` | Listar todos los pagos |
| GET | `/api/pagos/pendientes` | Alumnos sin pago registrado |
| GET | `/api/pagos/alumno/{id}` | Pagos de un alumno específico |
| POST | `/api/pagos` | Registrar un pago |
| GET | `/api/grados` | Listar grados |
| GET | `/api/reportes/alumnos` | Reporte de alumnos (Excel/PDF) |

---

## Flujo de Autenticación

```
1. Usuario escribe username + clave en /login
2. Angular llama a POST /api/auth/login
3. Spring Security valida con BCrypt
4. Servidor retorna datos del usuario en sesión
5. Angular guarda el estado en AuthService
6. authGuard protege todas las rutas privadas
7. Si no está autenticado → redirige a /login
```

---

## Módulo de Pagos

El módulo más complejo del sistema. Tiene 3 vistas:

### Vista Pendientes (por defecto)
- Consulta `GET /api/pagos/pendientes`
- Muestra tabla de alumnos que **no tienen ningún pago registrado**
- Botón "Pagar" por cada fila que pre-selecciona al alumno

### Vista Procesar Pago
- Formulario dinámico con 4 métodos de pago:
  - 💳 **Tarjeta** — Número, titular, vencimiento, CVV
  - 🏦 **Transferencia** — Banco (BCP/BBVA/etc), Nº operación
  - 📱 **Yape/Plin** — QR decorativo + número de celular
  - 💵 **Efectivo (Tesorería)** — Solo observaciones
- Animación de "Procesando..." de 1.5s
- Al completar → actualiza la lista de pendientes

### Vista Historial
- Tabla de todos los pagos registrados
- Filtro por alumno

---

# 🚀 Manual de Ejecución — Helen School

## Requisitos previos

Asegúrate de tener instalado:

| Herramienta | Versión mínima | Verificar con |
|---|---|---|
| Java JDK | 17 o superior | `java -version` |
| Maven | 3.9+ | `mvn -version` |
| Node.js | 18 o superior | `node -v` |
| Angular CLI | 17+ | `ng version` |
| Google Chrome | Cualquier versión reciente | — |

---

## Estructura de carpetas del proyecto

```
Proyecto DSW 2/
├── colegio/              ← Backend (Spring Boot)
├── frontend-colegio/     ← Frontend (Angular)
└── bdProyectoDSWII.sql   ← Script SQL (referencia, no necesario con Railway)
```

---

## Paso 1 — Iniciar el Backend (Spring Boot)

Abre una terminal **PowerShell** y ejecuta:

```powershell
# 1. Entrar a la carpeta del backend
cd "d:\CIBERTEC\6toCiclo\Modulo02\DESARROLLO DE SERVICIOS WEB II\EVALUACIONES\PROYECTO\Proyecto DSW 2\colegio"

# 2. Configurar conexión a Railway PostgreSQL
$env:SPRING_DATASOURCE_URL="jdbc:postgresql://mainline.proxy.rlwy.net:36438/railway?sslmode=require"
$env:PGUSER="postgres"
$env:PGPASSWORD="nfhKwdGbdnPGAFHVgnsKbdXMUKhwAyCb"

# 3. Ejecutar el backend
mvn spring-boot:run
```

> ✅ El backend está listo cuando veas:
> `Started ColegioApplication in X seconds`
> `Tomcat started on port 8080`

El backend queda en: **http://localhost:8080**

---

## Paso 2 — Iniciar el Frontend (Angular)

Abre una **segunda terminal PowerShell** (no cierres la primera) y ejecuta:

```powershell
# 1. Entrar a la carpeta del frontend
cd "d:\CIBERTEC\6toCiclo\Modulo02\DESARROLLO DE SERVICIOS WEB II\EVALUACIONES\PROYECTO\Proyecto DSW 2\frontend-colegio"

# 2. Instalar dependencias (solo la primera vez)
npm install

# 3. Iniciar el servidor de desarrollo
ng serve --open
```

> ✅ El frontend está listo cuando veas:
> `Application bundle generation complete`
> `Local: http://localhost:4200/`

El navegador se abre automáticamente en: **http://localhost:4200**

---

## Paso 3 — Iniciar Sesión

En el navegador en `http://localhost:4200`:

| Campo | Valor |
|---|---|
| **Usuario** | `mrodriguez` |
| **Contraseña** | `123456` |

O también:

| Campo | Valor |
|---|---|
| **Usuario** | `lgonzales` |
| **Contraseña** | `admin` |

---

## Módulos disponibles

Una vez dentro del sistema verás en el sidebar:

| Módulo | Descripción |
|---|---|
| 📊 Panel de Control | Dashboard con estadísticas generales |
| 👨‍🎓 Estudiantes | CRUD de alumnos |
| 📚 Grados | Gestión de grados y secciones |
| 👨‍👩‍👧 Tutores | Gestión de tutores/apoderados |
| 👨‍🏫 Docentes | Gestión de docentes |
| 📝 Matrículas | Registro de matrículas |
| 💳 Pagos | Módulo de pagos de matrícula |
| 📈 Reportes | Exportar reportes en Excel/PDF |

---

## Ejecutar Pruebas

### Pruebas Unitarias (sin abrir navegador)
```powershell
cd "...\colegio"
mvn test
```

---

## ☁️ Paso 4 — Despliegue en la Nube (Railway)

El sistema está configurado para ejecutarse completamente en la nube usando **Railway**.

### 1. Base de Datos (PostgreSQL)
1. En Railway, crea un nuevo servicio de **PostgreSQL**.
2. Copia las credenciales generadas (`DATABASE_URL`, `PGUSER`, `PGPASSWORD`, etc.).

### 2. Backend (Spring Boot)
1. Conecta tu cuenta de GitHub a Railway y selecciona el repositorio del proyecto.
2. Railway detectará automáticamente el archivo `pom.xml` y construirá el proyecto Java.
3. En la sección **Variables**, agrega las credenciales de PostgreSQL:
   - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://[HOST]:[PORT]/[DB]?sslmode=require`
   - `PGUSER` = `[USER]`
   - `PGPASSWORD` = `[PASSWORD]`
4. Ve a **Settings -> Environment** y genera un dominio público (Ej. `colegio-backend.up.railway.app`).

### 3. Frontend (Angular)
1. En el mismo proyecto de Railway, despliega otro servicio conectado al mismo repositorio, pero esta vez con la configuración para el frontend.
2. Modifica el comando de inicio en Railway para servir los archivos estáticos generados por Angular:
   - Command: `npx serve -s dist/leer-api-angular-18/browser`
3. Genera un dominio público para este servicio (Ej. `colegio-frontend.up.railway.app`).
4. Accede a este dominio desde tu navegador para usar el sistema en la nube.

---

## Solución a errores comunes

| Error | Causa | Solución |
|---|---|---|
| `password authentication failed` | Credenciales de BD incorrectas | Configurar las variables `$env:SPRING_DATASOURCE_URL`, `$env:PGUSER`, `$env:PGPASSWORD` |
| `No plugin found for prefix 'spring-boot'` | Ejecutando Maven fuera de la carpeta `colegio` | Entrar a la carpeta `colegio` antes de ejecutar |
| `ERR_CONNECTION_REFUSED` en el frontend | El backend no está corriendo | Iniciar el backend primero (Paso 1) |
| `port 4200 is already in use` | Angular ya está corriendo | Cerrar la terminal anterior o usar `ng serve --port 4201` |
| `Cannot find module` en Angular | Falta instalar dependencias | Ejecutar `npm install` |
