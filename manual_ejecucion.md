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
mvn test "-Dtest=com.cibertec.colegio.pago.PagoServiceTest,com.cibertec.colegio.pago.PagoControllerTest"
```

### Pruebas Selenium (abre Chrome automáticamente)
> ⚠️ El backend y frontend deben estar corriendo primero.

```powershell
cd "...\colegio"
mvn test "-Dtest=com.cibertec.colegio.selenium.PagoSeleniumTest"
```

---

## Solución a errores comunes

| Error | Causa | Solución |
|---|---|---|
| `password authentication failed` | Credenciales de BD incorrectas | Configurar las variables `$env:SPRING_DATASOURCE_URL`, `$env:PGUSER`, `$env:PGPASSWORD` |
| `No plugin found for prefix 'spring-boot'` | Ejecutando Maven fuera de la carpeta `colegio` | Entrar a la carpeta `colegio` antes de ejecutar |
| `ERR_CONNECTION_REFUSED` en el frontend | El backend no está corriendo | Iniciar el backend primero (Paso 1) |
| `port 4200 is already in use` | Angular ya está corriendo | Cerrar la terminal anterior o usar `ng serve --port 4201` |
| `Cannot find module` en Angular | Falta instalar dependencias | Ejecutar `npm install` |
