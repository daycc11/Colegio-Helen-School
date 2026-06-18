# 🏫 Sistema de Gestión Escolar - HELEN SCHOOL

Helen School es una plataforma web integral diseñada para gestionar los procesos académicos y administrativos de una institución educativa. Permite controlar matrículas, asignaciones académicas, pagos y ofrece un panel de estadísticas dinámico para tomar decisiones informadas.

---

## 🚀 Características Principales

*   **Autenticación y Seguridad:** Sistema de login seguro con contraseñas encriptadas (Bcrypt) y gestión de roles (Administrador, etc.).
*   **Dashboard Interactivo:** Gráficas dinámicas en tiempo real que muestran la evolución de las matrículas por mes y la distribución de alumnos por nivel académico.
*   **Gestión de Alumnos:** Registro, edición, eliminación y visualización de la lista de alumnos.
*   **Matrículas y Asignaciones:** Sistema para asignar alumnos a grados y secciones específicas, y designar docentes a dichos grados.
*   **Control de Pagos:** Registro de mensualidades con cálculo automático de mora según la fecha de pago y visualización de estados (Pagado / Con Mora).
*   **Diseño Moderno:** Interfaz de usuario responsive, rápida e intuitiva, construida con las últimas prácticas de diseño web.

---

## 💻 Tecnologías Utilizadas

El proyecto está dividido en dos grandes bloques, utilizando una arquitectura moderna de cliente-servidor:

### Backend (Servidor y API)
*   **Lenguaje:** Java 17+
*   **Framework:** Spring Boot 3
*   **Seguridad:** Spring Security (con Bcrypt para las contraseñas)
*   **ORM:** Hibernate / Spring Data JPA
*   **Gestor de Dependencias:** Maven

### Frontend (Interfaz de Usuario)
*   **Framework:** Angular 18 (Arquitectura basada en componentes y servicios)
*   **Lenguaje:** TypeScript / HTML5
*   **Estilos:** CSS3 Puro y Bootstrap 5 (para diseño responsivo e íconos)
*   **Librerías Adicionales:** Chart.js (para la renderización del dashboard)

### Base de Datos & Despliegue
*   **Motor:** PostgreSQL
*   **Cloud (Nube):** Railway (Despliegue integral de Base de Datos, Backend y Frontend)

---

## 📁 Estructura del Proyecto

El repositorio está dividido en dos carpetas principales:

1.  **`/colegio`**: Contiene todo el código del Backend en Java (Modelos, Controladores, Servicios y Repositorios). Aquí se expone la API REST en el puerto `8080`.
2.  **`/frontend-colegio`**: Contiene todo el código fuente de Angular. Se comunica directamente con la API del backend para consumir los datos. Se ejecuta típicamente en el puerto `4200`.

---

## 🛠️ Cómo Ejecutar el Proyecto

### Opción 1: Ejecución Local
**1. Levantar el Backend (Spring Boot)**
Navega a la carpeta `/colegio` y ejecuta:
```bash
mvn spring-boot:run
```
*(El backend se conectará automáticamente a la base de datos de Railway y se expondrá en `http://localhost:8080`)*

**2. Levantar el Frontend (Angular)**
Navega a la carpeta `/frontend-colegio`, instala las dependencias e inicia el servidor:
```bash
npm install
npm run start
```
*(Ingresa a `http://localhost:4200` en tu navegador para ver la página)*

### Opción 2: Ejecución en la Nube (Producción)
Actualmente, el proyecto está configurado para desplegarse fácilmente en **Railway**.
1. El Backend se despliega de forma automática al detectar el archivo `pom.xml`. Solo requiere configurar las variables de entorno de PostgreSQL (`SPRING_DATASOURCE_URL`, `PGUSER`, `PGPASSWORD`).
2. El Frontend compila la versión de producción (`npm run build`) y se sirve utilizando el comando de Railway: `npx serve -s dist/leer-api-angular-18/browser`.

---
*Desarrollado para el curso de Desarrollo de Servicios Web II - Cibertec.*
