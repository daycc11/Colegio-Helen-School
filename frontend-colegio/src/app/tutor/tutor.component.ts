import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Datos } from './datos';
import { DatosServicetutor } from '../datos.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tutor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tutor.component.html',
  styleUrls: ['./tutor.component.css']
})
export class TutorComponent implements OnInit {

  tutores: Datos[] = [];
  filtro = '';
  cargando = false;

  modoEdicion = false;
  mostrarModal = false;
  mostrarModalEliminar = false;
  mensaje = '';
  mensajeError = false;

  tutor: Datos = this.nuevoTutor();

  tutorEliminarId: number | null = null;
  tutorEliminarNombre = '';

  parentescos: string[] = [
    'Padre', 'Madre', 'Tío', 'Tía',
    'Hermano', 'Hermana', 'Abuelo', 'Abuela', 'Apoderado'
  ];

  constructor(
    private datosService: DatosServicetutor,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void { 
    this.listarTutores(); 
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        setTimeout(() => {
          this.modoEdicion = false;
          this.tutor = this.nuevoTutor();
          this.mostrarModal = true;
        }, 0);
      }
    });
  }

  get tutoresFiltrados(): Datos[] {
    const f = this.filtro.toLowerCase();
    if (!f) return this.tutores;
    return this.tutores.filter(t =>
      `${t.nombres} ${t.apellidos} ${t.dni} ${t.parentesco}`.toLowerCase().includes(f)
    );
  }

  paginaActual = 1;
  porPagina = 20;

  get paginados(): Datos[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.tutoresFiltrados.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.tutoresFiltrados.length / this.porPagina) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get inicioMostrado(): number {
    if (this.tutoresFiltrados.length === 0) return 0;
    return (this.paginaActual - 1) * this.porPagina + 1;
  }

  get finMostrado(): number {
    const fin = this.paginaActual * this.porPagina;
    return fin > this.tutoresFiltrados.length ? this.tutoresFiltrados.length : fin;
  }

  nuevoTutor(): Datos {
    return {
      id: undefined,
      nombres: '',
      apellidos: '',
      dni: '',
      direccion: '',
      telefono: '',
      email: '',
      parentesco: ''
    };
  }

  listarTutores(): void {
    this.datosService.getDatos().subscribe({
      next: (tutores) => {
        this.tutores = tutores;
        if (this.tutores.length === 0) {
          this.mensaje = 'No hay Registro de Tutor';
          this.mensajeError = true;
        } else {
          this.mensaje = '';
        }
      },
      error: (error) => {
        console.error(error);
        this.mensaje = 'No hay Registro de Tutores';
        this.mensajeError = true;
      }
    });
  }

  abrirModalRegistro(): void {
    this.modoEdicion = false;
    this.tutor = this.nuevoTutor();
    this.mensaje = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.tutor = this.nuevoTutor();
  }

  guardarTutor(): void {
    if (
      !this.tutor.nombres ||
      !this.tutor.apellidos ||
      !this.tutor.dni ||
      !this.tutor.direccion ||
      !this.tutor.telefono ||
      !this.tutor.email ||
      !this.tutor.parentesco
    ) {
      this.mensaje = 'Complete todos los campos';
      return;
    }

    if (this.modoEdicion && this.tutor.id) {
      this.datosService.actualizarTutor(this.tutor.id, this.tutor).subscribe({
        next: () => {
          this.mensaje = 'Tutor actualizado correctamente';
          this.mensajeError = false;
          this.cerrarModal();
          this.listarTutores();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al actualizar tutor';
          this.mensajeError = true;
        }
      });
    } else {
      this.datosService.crearTutor(this.tutor).subscribe({
        next: () => {
          this.mensaje = 'Tutor registrado correctamente';
          this.mensajeError = false;
          this.cerrarModal();
          this.listarTutores();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al registrar tutor';
          this.mensajeError = true;
        }
      });
    }
  }

  editarTutor(tutor: Datos): void {
    this.modoEdicion = true;
    this.mostrarModal = true;
    this.mensaje = '';

    this.tutor = {
      id: tutor.id,
      nombres: tutor.nombres,
      apellidos: tutor.apellidos,
      dni: tutor.dni,
      direccion: tutor.direccion,
      telefono: tutor.telefono,
      email: tutor.email,
      parentesco: tutor.parentesco
    };
  }

  abrirModalEliminar(tutor: Datos): void {
    this.tutorEliminarId = tutor.id ?? null;
    this.tutorEliminarNombre = `${tutor.nombres} ${tutor.apellidos}`;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.tutorEliminarId = null;
    this.tutorEliminarNombre = '';
  }

  confirmarEliminar(): void {
    if (!this.tutorEliminarId) {
      return;
    }

    this.datosService.eliminarTutor(this.tutorEliminarId).subscribe({
      next: () => {
        this.mensaje = 'Tutor eliminado correctamente';
        this.mensajeError = false;
        this.cerrarModalEliminar();
        this.listarTutores();
      },
      error: (error) => {
        console.error(error);
        this.mensajeError = true;

        if (error.status === 409 && error.error?.mensaje) {
          this.mensaje = error.error.mensaje;
        } else {
          this.mensaje = 'No se puede eliminar este tutor porque tiene alumnos asignados.';
        }

        this.cerrarModalEliminar();
      }
    });
  }
}