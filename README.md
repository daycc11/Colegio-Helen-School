# 🏫 Sistema de Gestión Escolar - HELEN SCHOOL

## 1. FUNDAMENTACIÓN
El proyecto permite construir servicios web en Java utilizando Spring Data, Lombok, Spring Boot (MVC/REST) y Spring Security de forma combinada, exponiendo la solución en la nube y conectándola a un cliente moderno desarrollado en Angular.

## 2. OBJETIVO
- **OBJ 1.-** Exponer servicios web e implementar una solución Java con frameworks modernos y desplegarla en la nube (Railway).
- **OBJ 2.-** Aplicar buenas prácticas y patrones de diseño en la implementación de esta solución (Arquitectura en capas, RESTful APIs, seguridad con JWT/Session).

## 3. ESPECIFICACIÓN Y ALCANCE DEL PROYECTO
El proyecto cuenta con las siguientes funcionalidades:
- Un servicio web Rest de login, donde el usuario y password están en una Base de Datos y el campo de contraseña está cifrado utilizando **BCryptPasswordEncoder**.
- Servicios web RESTful implementando los métodos **GET, POST, PUT y DELETE**. Cada funcionalidad principal (Alumnos, Aulas, Matrículas, Pagos) expone su propia API.
- Toda la información de los servicios web se almacena en una base de datos relacional **PostgreSQL**.
- La aplicación se encuentra expuesta y desplegada en la nube utilizando **Railway** (tanto para la Base de Datos, el Backend en Spring Boot y el Frontend en Angular).

## 4. ESTRUCTURA DEL PROYECTO

### 4.1. Resumen
Helen School es una plataforma web integral para gestionar procesos académicos y administrativos. El proyecto abarca la creación de una API RESTful robusta en Java (Spring Boot) y un cliente interactivo (Angular) para administrar alumnos, tutores, matrículas, grados, secciones y control de pagos.

### 4.2. Introducción
La digitalización de las instituciones educativas es fundamental en la actualidad. El presente proyecto tiene como propósito automatizar el control académico y financiero del colegio Helen School. El diagnóstico reveló procesos manuales lentos, por lo que el objetivo principal es optimizar la gestión de matrículas y pagos, impactando de forma directa en la eficiencia administrativa del colegio.

### 4.3. Diagnóstico (Análisis SEPTE)
- **Social:** Facilita la comunicación y el orden en la comunidad educativa (padres, alumnos, administración), mejorando la confianza en la institución.
- **Económica:** Reduce costos operativos al minimizar el uso de papel y tiempo en procesos manuales de matrícula y cobranza.
- **Tecnológica:** Permite a la institución modernizarse utilizando herramientas cloud (Railway), bases de datos escalables (PostgreSQL) y seguridad moderna (Spring Security).

### 4.4. Objetivos (SMART)
- **OBJ 1.-** Reducir el tiempo del proceso de matrícula y registro de pagos en un 50% mediante la automatización web antes de finalizar el año escolar actual.
- **OBJ 2.-** Garantizar que el 100% de la información de los estudiantes y sus pagos se encuentre respaldada y encriptada en la nube para el cierre del presente ciclo académico.

### 4.5. Justificación del Proyecto
El proyecto contribuye positivamente a la mejora del proceso de registro estudiantil y control financiero, erradicando la pérdida de datos y la redundancia.
- **Beneficiarios directos:** El personal administrativo y de secretaría que utilizará el sistema a diario para registrar alumnos, realizar cobros de matrícula y administrar las aulas.
- **Beneficiarios indirectos:** Los padres de familia (tutores) y los estudiantes, quienes disfrutarán de un proceso de matrícula más rápido, transparente y con un historial de pagos claro.

### 4.6. Definición y Alcance
El sistema cubre la lógica completa de un colegio: registro de tutores, inscripción de alumnos, asignación a grados y secciones (Aulas), matriculación y el pago de dicha matrícula. 
Se incluyen manuales de ejecución (local y nube), documentación técnica y un documento de arquitectura que detallan las decisiones de diseño. El alcance se limita a la gestión administrativa interna y no incluye, por el momento, un portal de notas para alumnos.

### 4.7. Productos y Entregables
- Código fuente completo del Backend (Spring Boot) y Frontend (Angular).
- Base de datos PostgreSQL estructurada.
- Documentación Técnica, Manual de Ejecución y Arquitectura del Proyecto.
- **Vídeo - Demo Reel Estructurado:** Un recorrido de 3 a 5 minutos mostrando el funcionamiento real del sistema desplegado en la nube.
