import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Datos } from './datos';
import { DatosService, DatosServicegrado, DatosServicetutor, DatosServiceSeccion } from '../datos.service';

import { Datos as GradoDatos } from '../grado/datos';
import { SeccionDatos } from '../seccion/datos';
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
  grados: GradoDatos[] = [];
  secciones: SeccionDatos[] = [];
  tutores: TutorDatos[] = [];

  modoEdicion = false;
  mostrarModal = false;
  mostrarModalEliminar = false;
  mensaje = '';

  alumnoEliminarId: number | null = null;
  alumnoEliminarNombre = '';

  alumno: AlumnoForm = this.nuevoAlumno();

  constructor(
    private datosService: DatosService,
    private gradoService: DatosServicegrado,
    private seccionService: DatosServiceSeccion,
    private tutorService: DatosServicetutor
  ) {}

  ngOnInit(): void {
    this.listarAlumnos();
    this.listarGrados();
    this.listarSecciones();
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
        this.mensaje = 'Error al listar alumnos';
      }
    });
  }

  listarGrados(): void {
    this.gradoService.getDatos().subscribe({
      next: (grados) => {
        this.grados = grados;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  listarSecciones(): void {
    this.seccionService.getDatos().subscribe({
      next: (secciones) => {
        this.secciones = secciones;
      },
      error: (error) => {
        console.error(error);
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
          this.cerrarModal();
          this.listarAlumnos();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al actualizar alumno';
        }
      });
    } else {
      this.datosService.crearAlumno(alumnoEnviar).subscribe({
        next: () => {
          this.mensaje = 'Alumno registrado correctamente';
          this.cerrarModal();
          this.listarAlumnos();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al registrar alumno. Verifique que el DNI no esté repetido.';
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
      this.cerrarModalEliminar();
      this.listarAlumnos();
    },
    error: (error) => {
      console.error(error);
      this.mensaje = 'Error al eliminar alumno';
    }
  });
}
}