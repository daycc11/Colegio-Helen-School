import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Datos } from './datos';

import { DatosService, DatosServicetutor } from '../datos.service';
import { Datos as TutorDatos } from '../tutor/datos';

interface AlumnoForm {
  id?: number | null;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  idTutor: number | null;
}

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alumno.component.html',
  styleUrls: ['./alumno.component.css']
})
export class AlumnoComponent implements OnInit {

  datos: Datos[] = [];
  filtroAlumno = '';

  tutores: TutorDatos[] = [];

  modoEdicion = false;
  mostrarModal = false;
  mostrarModalEliminar = false;
  mensaje = '';
  mensajeError = false;

  alumnoEliminarId: number | null = null;
  alumnoEliminarNombre = '';

  alumno: AlumnoForm = this.nuevoAlumno();

  constructor(
    private datosService: DatosService,
    private tutorService: DatosServicetutor
  ) {}

  ngOnInit(): void {
    this.listarAlumnos();

    this.listarTutores();
  }

  nuevoAlumno(): AlumnoForm {
    return {
      id: null,
      nombres: '',
      apellidos: '',
      dni: '',
      fechaNacimiento: '',
      idTutor: null
    };
  }

  listarAlumnos(): void {
    this.datosService.getDatos().subscribe({
      next: (datos) => {
        this.datos = datos;
      },
      error: (error) => {
        console.error(error);
        this.mensaje = 'No hay Registro de Estudiantes';
        this.mensajeError = true;
      }
    });
  }



  listarTutores(): void {
    this.tutorService.getDatos().subscribe({
      next: (tutores) => {
        this.tutores = tutores;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  abrirModalRegistro(): void {
    this.modoEdicion = false;
    this.alumno = this.nuevoAlumno();
    this.mensaje = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.alumno = this.nuevoAlumno();
  }

  guardarAlumno(): void {
    if (
      !this.alumno.nombres ||
      !this.alumno.apellidos ||
      !this.alumno.dni ||
      !this.alumno.fechaNacimiento ||
      !this.alumno.idTutor
    ) {
      this.mensaje = 'Complete todos los campos';
      return;
    }

    const alumnoEnviar: Datos = {
      id: this.alumno.id ?? undefined,
      nombres: this.alumno.nombres,
      apellidos: this.alumno.apellidos,
      dni: this.alumno.dni,
      fechaNacimiento: this.alumno.fechaNacimiento,
      tutor: {
        id: this.alumno.idTutor
      }
    };

    if (this.modoEdicion && this.alumno.id) {
      this.datosService.actualizarAlumno(this.alumno.id, alumnoEnviar).subscribe({
        next: () => {
          this.mensaje = 'Alumno actualizado correctamente';
          this.mensajeError = false;
          this.cerrarModal();
          this.listarAlumnos();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al actualizar alumno';
          this.mensajeError = true;
        }
      });
    } else {
      this.datosService.crearAlumno(alumnoEnviar).subscribe({
        next: () => {
          this.mensaje = 'Alumno registrado correctamente';
          this.mensajeError = false;
          this.cerrarModal();
          this.listarAlumnos();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al registrar alumno. Verifique que el DNI no esté repetido.';
          this.mensajeError = true;
        }
      });
    }
  }

  editarAlumno(dato: Datos): void {
    this.modoEdicion = true;
    this.mostrarModal = true;
    this.mensaje = '';

    this.alumno = {
      id: dato.id ?? null,
      nombres: dato.nombres,
      apellidos: dato.apellidos,
      dni: dato.dni,
      fechaNacimiento: dato.fechaNacimiento,
      idTutor: dato.tutor?.id ?? null
    };
  }

  normalizarTexto(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

get alumnosFiltrados(): Datos[] {
  const filtro = this.normalizarTexto(this.filtroAlumno);

  if (!filtro) {
    return this.datos;
  }

  return this.datos.filter(alumno => {
    const nombres = this.normalizarTexto(alumno.nombres || '');
    const apellidos = this.normalizarTexto(alumno.apellidos || '');
    const dni = this.normalizarTexto(alumno.dni || '');

    const nombreCompleto1 = this.normalizarTexto(`${alumno.nombres || ''} ${alumno.apellidos || ''}`);
    const nombreCompleto2 = this.normalizarTexto(`${alumno.apellidos || ''} ${alumno.nombres || ''}`);

    return (
      nombres.includes(filtro) ||
      apellidos.includes(filtro) ||
      dni.includes(filtro) ||
      nombreCompleto1.includes(filtro) ||
      nombreCompleto2.includes(filtro)
    );
  });
}

  paginaActual = 1;
  porPagina = 20;

  get paginados(): Datos[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.alumnosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.alumnosFiltrados.length / this.porPagina) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get inicioMostrado(): number {
    if (this.alumnosFiltrados.length === 0) return 0;
    return (this.paginaActual - 1) * this.porPagina + 1;
  }

  get finMostrado(): number {
    const fin = this.paginaActual * this.porPagina;
    return fin > this.alumnosFiltrados.length ? this.alumnosFiltrados.length : fin;
  }

 abrirModalEliminar(dato: Datos): void {
  this.alumnoEliminarId = dato.id ?? null;
  this.alumnoEliminarNombre = `${dato.nombres} ${dato.apellidos}`;
  this.mostrarModalEliminar = true;
}

cerrarModalEliminar(): void {
  this.mostrarModalEliminar = false;
  this.alumnoEliminarId = null;
  this.alumnoEliminarNombre = '';
}

confirmarEliminar(): void {
  if (!this.alumnoEliminarId) {
    return;
  }

  this.datosService.eliminarAlumno(this.alumnoEliminarId).subscribe({
    next: () => {
      this.mensaje = 'Alumno eliminado correctamente';
      this.mensajeError = false;
      this.cerrarModalEliminar();
      this.listarAlumnos();
    },
    error: (error) => {
      console.error(error);
      this.mensaje = 'Error al eliminar alumno';
      this.mensajeError = true;
    }
  });
}
}