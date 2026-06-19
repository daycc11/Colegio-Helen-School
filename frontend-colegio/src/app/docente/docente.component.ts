import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Datos } from './datos';
import { DatosServiceDocente } from '../datos.service';
import { ActivatedRoute } from '@angular/router';

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



  constructor(
    private datosService: DatosServiceDocente,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listarDocentes();
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        setTimeout(() => {
          this.modoEdicion = false;
          this.docente = this.nuevoDocente();
          this.mostrarModal = true;
        }, 0);
      }
    });
  }

  nuevoDocente(): Datos {
    return {
      id: undefined,
      nombres: '',
      apellidos: '',
      dni: '',
      telefono: '',
      email: '',
      direccion: ''
    };
  }

  listarDocentes(): void {
    this.cargando = true;
    this.datosService.getDatos().subscribe({
      next: (data) => {
        this.docentes = data;
        this.cargando = false;
        if (this.docentes.length === 0) {
          this.mostrarMensaje('No hay Registro de Docente', 'error');
        }
      },
      error: () => {
        this.mostrarMensaje('No hay Registro de Docente', 'error');
        this.cargando = false;
      }
    });
  }

  get docentesFiltrados(): Datos[] {
    const f = this.filtro.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (!f) return this.docentes;
    return this.docentes.filter(d => {
      const texto = `${d.nombres} ${d.apellidos} ${d.dni}`.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return texto.includes(f);
    });
  }

  paginaActual = 1;
  porPagina = 8;

  get paginados(): Datos[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.docentesFiltrados.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.docentesFiltrados.length / this.porPagina) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get inicioMostrado(): number {
    if (this.docentesFiltrados.length === 0) return 0;
    return (this.paginaActual - 1) * this.porPagina + 1;
  }

  get finMostrado(): number {
    const fin = this.paginaActual * this.porPagina;
    return fin > this.docentesFiltrados.length ? this.docentesFiltrados.length : fin;
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
      !this.docente.dni
    ) {
      this.mensaje = 'Complete los campos obligatorios (Nombres, Apellidos, DNI).';
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



  private mostrarMensaje(texto: string, tipo: 'success' | 'error'): void {
    this.mensaje = texto;
    this.mensajeTipo = tipo;
    setTimeout(() => this.mensaje = '', 4000);
  }
}
