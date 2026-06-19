import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DatosServiceMatricula, DatosService } from '../datos.service';
import { AulaService } from '../services/aula.service';
import { Datos as AlumnoDatos } from '../alumno/datos';
import { Aula } from '../services/aula.service';
import { ActivatedRoute } from '@angular/router';

interface MatriculaForm {
  id?: number | null;
  idAlumno: number | null;
  idAula: number | null;
  // Campos de pago (solo para edición)
  monto?: number | null;
  idMetodoPago?: number | null;
  fechaPago?: string | null;
}

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {

  matriculas: any[] = [];
  alumnos: AlumnoDatos[] = [];
  aulas: Aula[] = [];
  metodosPago: any[] = [];

  cargando = true;
  filtro = '';

  paginaActual = 1;
  porPagina = 8;

  mostrarModal = false;
  modoEdicion = false;
  mensaje = '';
  mensajeError = false;

  // Matrícula actual en edición/creación
  matricula: MatriculaForm = this.nuevaMatricula();
  // Datos del pago actuales (para mostrar info en modo edición)
  matriculaOriginal: any = null;

  constructor(
    private matriculaService: DatosServiceMatricula,
    private alumnoService: DatosService,
    private aulaService: AulaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.cargarMatriculas();
    this.cargarAlumnos();
    this.cargarAulas();

    this.metodosPago = [
      { id: 1, nombre: 'Tarjetas' },
      { id: 2, nombre: 'Transferencia' },
      { id: 3, nombre: 'Yape' },
      { id: 4, nombre: 'Pago en Tesorería' }
    ];

    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        setTimeout(() => {
          this.modoEdicion = false;
          this.matricula = this.nuevaMatricula();
          this.matriculaOriginal = null;
          this.mostrarModal = true;
        }, 0);
      }
    });
  }

  nuevaMatricula(): MatriculaForm {
    return {
      id: null,
      idAlumno: null,
      idAula: null,
      monto: null,
      idMetodoPago: null,
      fechaPago: null
    };
  }

  cargarMatriculas(): void {
    this.matriculaService.getMatriculas().subscribe({
      next: (data) => {
        this.matriculas = data;
        this.cargando = false;
        if (this.matriculas.length === 0) {
          this.mensaje = 'No hay Registro de Matrícula';
          this.mensajeError = true;
        } else {
          this.mensaje = '';
          this.mensajeError = false;
        }
      },
      error: (err) => {
        console.error('Error al cargar matrículas:', err);
        this.mensaje = 'No hay Registro de Matrícula';
        this.mensajeError = true;
        this.cargando = false;
      }
    });
  }

  cargarAlumnos(): void {
    this.alumnoService.getDatos().subscribe({
      next: (data) => this.alumnos = data,
      error: (error) => console.error(error)
    });
  }

  cargarAulas(): void {
    this.aulaService.getTodasAulas().subscribe({
      next: (data) => this.aulas = data,
      error: (error) => console.error(error)
    });
  }

  // Alumnos que AÚN no tienen matrícula (para el combo al crear)
  get alumnosSinMatricula(): AlumnoDatos[] {
    const idsMatriculados = new Set(
      this.matriculas.map((m: any) => m.alumno?.id).filter(Boolean)
    );
    return this.alumnos.filter(a => !idsMatriculados.has(a.id));
  }

  // Estado del pago de la matrícula en edición
  get matriculaEsPendiente(): boolean {
    if (!this.matriculaOriginal) return true;
    const nombre = this.matriculaOriginal?.estado?.nombre || '';
    return nombre.toLowerCase().includes('pendiente');
  }

  // Si el usuario ha llenado los campos de pago → se activará automáticamente
  get pagoCompleto(): boolean {
    return !!(this.matricula.idMetodoPago && this.matricula.monto && this.matricula.monto > 0);
  }

  abrirModalRegistro(): void {
    this.modoEdicion = false;
    this.mensaje = '';
    this.matriculaOriginal = null;
    this.matricula = this.nuevaMatricula();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.matriculaOriginal = null;
    this.matricula = this.nuevaMatricula();
    this.mensaje = '';
  }

  guardarMatricula(): void {
    if (!this.matricula.idAlumno || !this.matricula.idAula) {
      this.mensaje = 'Seleccione un estudiante y un aula.';
      this.mensajeError = true;
      return;
    }

    if (this.modoEdicion && this.matricula.id) {
      // ── MODO EDICIÓN ──
      // Validar: si quiere pagar, debe tener monto > 0
      if (this.matricula.idMetodoPago && (!this.matricula.monto || this.matricula.monto <= 0)) {
        this.mensaje = 'Ingrese un monto válido para registrar el pago.';
        this.mensajeError = true;
        return;
      }

      const payload: any = {
        alumno: { id: this.matricula.idAlumno },
        aula:   { id: this.matricula.idAula },
        pago: {
          monto:      this.matricula.monto ?? null,
          metodoPago: this.matricula.idMetodoPago ? { id: this.matricula.idMetodoPago } : null,
          fechaPago:  this.matricula.fechaPago || null
        }
      };

      this.matriculaService.actualizarMatricula(this.matricula.id, payload).subscribe({
        next: () => {
          this.mensaje = this.pagoCompleto
            ? '¡Pago registrado! Matrícula activada correctamente.'
            : 'Matrícula actualizada correctamente.';
          this.mensajeError = false;
          this.cerrarModal();
          this.cargarMatriculas();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al actualizar la matrícula.';
          this.mensajeError = true;
        }
      });

    } else {
      // ── MODO CREACIÓN ──
      // Validar que el alumno no tenga ya una matrícula en el MISMO AÑO ESCOLAR
      const aulaSeleccionada = this.aulas.find(a => a.id == this.matricula.idAula);
      if (aulaSeleccionada) {
        const idAnio = aulaSeleccionada.anioEscolar?.id;
        const yaMatriculadoEnAnio = this.matriculas.some(
          (m: any) => m.alumno?.id === this.matricula.idAlumno && m.aula?.anioEscolar?.id === idAnio
        );
        if (yaMatriculadoEnAnio) {
          this.mensaje = 'Este estudiante ya tiene una matrícula registrada para este año escolar.';
          this.mensajeError = true;
          return;
        }
      }

      const payload = {
        alumno: { id: this.matricula.idAlumno },
        aula:   { id: this.matricula.idAula }
        // El backend asigna estado=Pendiente y crea el pago automáticamente
      };

      this.matriculaService.crearMatricula(payload).subscribe({
        next: () => {
          this.mensaje = 'Matrícula registrada correctamente (Estado: Pendiente).';
          this.mensajeError = false;
          this.cerrarModal();
          this.cargarMatriculas();
        },
        error: (error) => {
          console.error(error);
          const msg = error?.error;
          this.mensaje = typeof msg === 'string' ? msg : 'Error al registrar matrícula.';
          this.mensajeError = true;
        }
      });
    }
  }

  editarMatricula(m: any): void {
    this.modoEdicion = true;
    this.mensaje = '';
    this.matriculaOriginal = m;
    this.mostrarModal = true;

    this.matricula = {
      id:           m.id ?? null,
      idAlumno:     m.alumno?.id ?? null,
      idAula:       m.aula?.id ?? null,
      monto:        m.pago?.monto > 0 ? m.pago.monto : null,
      idMetodoPago: m.pago?.metodoPago?.id ?? null,
      fechaPago:    m.pago?.fechaPago ?? null
    };
  }

  normalizarTexto(texto: string): string {
    if (!texto) return '';
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  get filtrados(): any[] {
    const filtro = this.normalizarTexto(this.filtro);
    if (!filtro) return this.matriculas;
    return this.matriculas.filter(m => {
      const texto = this.normalizarTexto(
        `${m.alumno?.nombres} ${m.alumno?.apellidos} ${m.alumno?.dni} ${m.pago?.metodoPago?.nombre || ''}`
      );
      return texto.includes(filtro);
    });
  }

  get paginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.filtrados.slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.filtrados.length / this.porPagina) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get inicioMostrado(): number {
    if (this.filtrados.length === 0) return 0;
    return (this.paginaActual - 1) * this.porPagina + 1;
  }

  get finMostrado(): number {
    const fin = this.paginaActual * this.porPagina;
    return fin > this.filtrados.length ? this.filtrados.length : fin;
  }

  getIniciales(nombres: string, apellidos: string): string {
    return ((nombres?.charAt(0) || '') + (apellidos?.charAt(0) || '')).toUpperCase();
  }
}