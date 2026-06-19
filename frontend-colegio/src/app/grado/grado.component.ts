import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AsignacionAcademicaDatos } from '../asignacion/datos';
import { Datos as GradoDatos } from '../grado/datos';
import { SeccionDatos } from '../seccion/datos';
import { Datos as DocenteDatos } from '../docente/datos';

import { 
  DatosServiceAsignacion, 
  DatosServicegrado as DatosServiceGrado, 
  DatosServiceSeccion, 
  DatosServiceDocente,
  DatosServiceNivel
} from '../datos.service';

@Component({
  selector: 'app-grado', // Keeps the selector to avoid breaking routing
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grado.component.html',
  styleUrls: ['./grado.component.css']
})
export class GradoComponent implements OnInit {

  asignaciones: AsignacionAcademicaDatos[] = [];
  grados: GradoDatos[] = [];
  niveles: any[] = [];
  secciones: SeccionDatos[] = [];
  docentes: DocenteDatos[] = [];

  modoEdicion = false;
  mostrarModal = false;
  mostrarModalEliminar = false;
  mensaje = '';
  
  cargandoGrados = false;
  cargandoSecciones = false;
  cargandoDocentes = false;

  asignacion: AsignacionAcademicaDatos = this.nuevaAsignacion();
  
  asignacionEliminarId: number | null = null;

  // Variables for inline creation
  nuevoGradoNombre = '';
  nuevaSeccionNombre = '';
  nuevoDocente = { nombres: '', apellidos: '', dni: '' }; // Minimal fields for quick creation
  
  creandoGrado = false;
  creandoSeccion = false;
  creandoDocente = false;

  constructor(
    private asignacionService: DatosServiceAsignacion,
    private gradoService: DatosServiceGrado,
    private nivelService: DatosServiceNivel,
    private seccionService: DatosServiceSeccion,
    private docenteService: DatosServiceDocente
  ) {}

  ngOnInit(): void {
    this.listarAsignaciones();
    this.listarGrados();
    this.listarNiveles();
    this.listarSecciones();
    this.listarDocentes();
  }

  listarNiveles(): void {
    this.nivelService.getDatos().subscribe({
      next: (n) => this.niveles = n
    });
  }

  nuevaAsignacion(): AsignacionAcademicaDatos {
    return {
      id: undefined,
      grado: { id: 0, nombre: '' },
      nivel: { id: 0, nombre: '' },
      seccion: { id: 0, nombre: '' },
      docente: { id: 0, nombres: '', apellidos: '', dni: '', telefono: '', email: '', especialidad: '', direccion: '' }
    };
  }

  // ── Loaders ──────────────────────────────────

  listarAsignaciones(): void {
    this.asignacionService.getDatos().subscribe({
      next: (a) => this.asignaciones = a,
      error: () => this.mensaje = 'Error al listar asignaciones'
    });
  }

  listarGrados(): void {
    this.cargandoGrados = true;
    this.gradoService.getDatos().subscribe({
      next: (g) => { this.grados = g; this.cargandoGrados = false; },
      error: () => this.cargandoGrados = false
    });
  }

  listarSecciones(): void {
    this.cargandoSecciones = true;
    this.seccionService.getDatos().subscribe({
      next: (s) => { this.secciones = s; this.cargandoSecciones = false; },
      error: () => this.cargandoSecciones = false
    });
  }

  listarDocentes(): void {
    this.cargandoDocentes = true;
    this.docenteService.getDatos().subscribe({
      next: (d) => { this.docentes = d; this.cargandoDocentes = false; },
      error: () => this.cargandoDocentes = false
    });
  }

  // ── Inline Creation ─────────────────────────────────

  guardarNuevoGrado(): void {
    if (!this.nuevoGradoNombre) return;
    this.gradoService.crearGrado({ nombre: this.nuevoGradoNombre }).subscribe({
      next: (g) => {
        this.grados.push(g);
        this.asignacion.grado = g;
        this.nuevoGradoNombre = '';
        this.creandoGrado = false;
      },
      error: () => this.mensaje = 'Error al crear el nuevo grado. ¿Ya existe?'
    });
  }

  guardarNuevaSeccion(): void {
    if (!this.nuevaSeccionNombre) return;
    this.seccionService.crearSeccion({ nombre: this.nuevaSeccionNombre }).subscribe({
      next: (s) => {
        this.secciones.push(s);
        this.asignacion.seccion = s;
        this.nuevaSeccionNombre = '';
        this.creandoSeccion = false;
      },
      error: () => this.mensaje = 'Error al crear la nueva sección. ¿Ya existe?'
    });
  }

  guardarNuevoDocente(): void {
    if (!this.nuevoDocente.nombres || !this.nuevoDocente.apellidos || !this.nuevoDocente.dni) return;
    this.docenteService.crearDocente(this.nuevoDocente as DocenteDatos).subscribe({
      next: (d) => {
        this.docentes.push(d);
        this.asignacion.docente = d;
        this.nuevoDocente = { nombres: '', apellidos: '', dni: '' };
        this.creandoDocente = false;
      },
      error: () => this.mensaje = 'Error al crear el nuevo docente. ¿El DNI ya existe?'
    });
  }

  // ── Combo changes ──────────────────────────────────

  onGradoChange(event: any): void {
    if (event.target.value === 'NEW') {
      this.creandoGrado = true;
      this.asignacion.grado = { id: 0, nombre: '' };
    }
  }

  onSeccionChange(event: any): void {
    if (event.target.value === 'NEW') {
      this.creandoSeccion = true;
      this.asignacion.seccion = { id: 0, nombre: '' };
    }
  }

  onDocenteChange(event: any): void {
    if (event.target.value === 'NEW') {
      this.creandoDocente = true;
      this.asignacion.docente = { id: 0, nombres: '', apellidos: '', dni: '', telefono: '', email: '', especialidad: '', direccion: '' };
    }
  }

  compararPorId(item1: any, item2: any): boolean {
    return item1 && item2 ? item1.id === item2.id : item1 === item2;
  }

  // ── Modal ───────────────────────────────────────────

  abrirModalRegistro(): void {
    this.modoEdicion = false;
    this.asignacion = this.nuevaAsignacion();
    this.mensaje = '';
    this.creandoGrado = false;
    this.creandoSeccion = false;
    this.creandoDocente = false;
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
  }

  editarAsignacion(asignacion: AsignacionAcademicaDatos): void {
    this.modoEdicion = true;
    this.mostrarModal = true;
    this.mensaje = '';
    this.creandoGrado = false;
    this.creandoSeccion = false;
    this.creandoDocente = false;
    // Object copy
    this.asignacion = { ...asignacion };
  }

  guardarAsignacion(): void {
    if (!this.asignacion.grado?.id || !this.asignacion.nivel?.id || !this.asignacion.seccion?.id || !this.asignacion.docente?.id) {
      this.mensaje = 'Debe seleccionar un grado, un nivel, una sección y un docente válidos.';
      return;
    }

    const operacion = this.modoEdicion && this.asignacion.id
      ? this.asignacionService.actualizarAsignacion(this.asignacion.id, this.asignacion)
      : this.asignacionService.crearAsignacion(this.asignacion);

    operacion.subscribe({
      next: () => {
        this.mensaje = this.modoEdicion ? 'Asignación actualizada correctamente' : 'Asignación registrada correctamente';
        this.cerrarModal();
        this.listarAsignaciones();
      },
      error: () => this.mensaje = 'Error al guardar la asignación.'
    });
  }

  // ── Eliminar ────────────────────────────────────────

  abrirModalEliminar(id: number): void {
    this.asignacionEliminarId = id;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.asignacionEliminarId = null;
  }

  confirmarEliminar(): void {
    if (!this.asignacionEliminarId) return;
    this.asignacionService.eliminarAsignacion(this.asignacionEliminarId).subscribe({
      next: () => {
        this.mensaje = 'Asignación eliminada correctamente';
        this.cerrarModalEliminar();
        this.listarAsignaciones();
      },
      error: (error) => {
        this.mensaje = error.status === 409 && error.error?.mensaje
          ? error.error.mensaje
          : 'No se puede eliminar esta asignación porque está en uso.';
        this.cerrarModalEliminar();
      }
    });
  }
}