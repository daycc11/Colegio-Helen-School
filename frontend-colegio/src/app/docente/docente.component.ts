import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Datos } from './datos';
import { DatosServiceDocente } from '../datos.service';

@Component({
  selector: 'app-docente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css']
})
export class DocenteComponent implements OnInit {

  docentes: Datos[] = [];
  filtro = '';

  modoEdicion = false;
  mostrarModal = false;
  mostrarModalEliminar = false;
  cargando = false;
  mensaje = '';
  mensajeTipo: 'success' | 'error' = 'success';

  docente: Datos = this.nuevoDocente();

  docenteEliminarId: number | null = null;
  docenteEliminarNombre = '';

  especialidades: string[] = [
    'Matemáticas',
    'Comunicación',
    'Ciencias Naturales',
    'Historia y Geografía',
    'Inglés',
    'Educación Física',
    'Arte y Cultura',
    'Educación Religiosa',
    'Computación e Informática',
    'Tutoría',
    'Física',
    'Química',
    'Biología',
    'Economía',
    'Filosofía'
  ];

  constructor(private datosService: DatosServiceDocente) {}

  ngOnInit(): void {
    this.listarDocentes();
  }

  nuevoDocente(): Datos {
    return {
      id: undefined,
      nombres: '',
      apellidos: '',
      dni: '',
      telefono: '',
      email: '',
      especialidad: '',
      direccion: ''
    };
  }

  listarDocentes(): void {
    this.cargando = true;
    this.datosService.getDatos().subscribe({
      next: (data) => {
        this.docentes = data;
        this.cargando = false;
      },
      error: () => {
        this.mostrarMensaje('Error al cargar los docentes.', 'error');
        this.cargando = false;
      }
    });
  }

  get docentesFiltrados(): Datos[] {
    const f = this.filtro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!f) return this.docentes;
    return this.docentes.filter(d => {
      const texto = `${d.nombres} ${d.apellidos} ${d.dni} ${d.especialidad}`.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return texto.includes(f);
    });
  }

  abrirModalRegistro(): void {
    this.modoEdicion = false;
    this.docente = this.nuevoDocente();
    this.mensaje = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.docente = this.nuevoDocente();
    this.mensaje = '';
  }

  editarDocente(d: Datos): void {
    this.modoEdicion = true;
    this.mensaje = '';
    this.mostrarModal = true;
    this.docente = { ...d };
  }

  guardarDocente(): void {
    if (
      !this.docente.nombres ||
      !this.docente.apellidos ||
      !this.docente.dni ||
      !this.docente.especialidad
    ) {
      this.mensaje = 'Complete los campos obligatorios (Nombres, Apellidos, DNI, Especialidad).';
      this.mensajeTipo = 'error';
      return;
    }

    if (this.docente.dni.length !== 8 || !/^\d+$/.test(this.docente.dni)) {
      this.mensaje = 'El DNI debe tener exactamente 8 dígitos numéricos.';
      this.mensajeTipo = 'error';
      return;
    }

    if (this.modoEdicion && this.docente.id) {
      this.datosService.actualizarDocente(this.docente.id, this.docente).subscribe({
        next: () => {
          this.mostrarMensaje('Docente actualizado correctamente.', 'success');
          this.cerrarModal();
          this.listarDocentes();
        },
        error: (err) => {
          const msg = err.error?.mensaje || 'Error al actualizar docente.';
          this.mensaje = msg;
          this.mensajeTipo = 'error';
        }
      });
    } else {
      this.datosService.crearDocente(this.docente).subscribe({
        next: () => {
          this.mostrarMensaje('Docente registrado correctamente.', 'success');
          this.cerrarModal();
          this.listarDocentes();
        },
        error: (err) => {
          const msg = err.error?.mensaje || 'Error al registrar docente.';
          this.mensaje = msg;
          this.mensajeTipo = 'error';
        }
      });
    }
  }

  abrirModalEliminar(d: Datos): void {
    this.docenteEliminarId = d.id ?? null;
    this.docenteEliminarNombre = `${d.nombres} ${d.apellidos}`;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.docenteEliminarId = null;
    this.docenteEliminarNombre = '';
  }

  confirmarEliminar(): void {
    if (!this.docenteEliminarId) return;

    this.datosService.eliminarDocente(this.docenteEliminarId).subscribe({
      next: () => {
        this.mostrarMensaje('Docente eliminado correctamente.', 'success');
        this.cerrarModalEliminar();
        this.listarDocentes();
      },
      error: () => {
        this.mostrarMensaje('Error al eliminar el docente.', 'error');
        this.cerrarModalEliminar();
      }
    });
  }

  getIniciales(nombres: string, apellidos: string): string {
    return ((nombres?.charAt(0) || '') + (apellidos?.charAt(0) || '')).toUpperCase();
  }

  getColorEspecialidad(especialidad: string): string {
    const colores: { [key: string]: string } = {
      'Matemáticas': '#6366f1',
      'Comunicación': '#0891b2',
      'Ciencias Naturales': '#059669',
      'Historia y Geografía': '#d97706',
      'Inglés': '#7c3aed',
      'Educación Física': '#dc2626',
      'Arte y Cultura': '#db2777',
      'Computación e Informática': '#0284c7',
      'Física': '#4f46e5',
      'Química': '#16a34a',
      'Biología': '#15803d',
      'Filosofía': '#9333ea',
    };
    return colores[especialidad] || '#64748b';
  }

  private mostrarMensaje(texto: string, tipo: 'success' | 'error'): void {
    this.mensaje = texto;
    this.mensajeTipo = tipo;
    setTimeout(() => this.mensaje = '', 4000);
  }
}
