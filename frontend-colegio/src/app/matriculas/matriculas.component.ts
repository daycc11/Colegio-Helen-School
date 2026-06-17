import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DatosServiceMatricula, DatosServicegrado, DatosServicetutor, DatosServiceSeccion } from '../datos.service';
import { Datos as MatriculaDatos } from './datos';
import { Datos as GradoDatos } from '../grado/datos';
import { SeccionDatos } from '../seccion/datos';
import { Datos as TutorDatos } from '../tutor/datos';

interface MatriculaForm {
  id?: number | null;
  nombres: string;
  apellidos: string;
  dni: string;
  fechaNacimiento: string;
  idGrado: number | null;
  idSeccion: number | null;
  idTutor: number | null;
  // Nuevos campos
  fechaMatricula: string;
  fechaFinMatricula: string;
  metodoPago: string;
  montoPagado: number | null;
}

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matriculas.component.html',
  styleUrls: ['./matriculas.component.css']
})
export class MatriculasComponent implements OnInit {

  matriculas: MatriculaDatos[] = [];
  grados: GradoDatos[] = [];
  secciones: SeccionDatos[] = [];
  tutores: TutorDatos[] = [];

  cargando = true;
  filtro = '';

  paginaActual = 1;
  porPagina = 8;

  mostrarModal = false;
  modoEdicion = false;
  mensaje = '';

  matricula: MatriculaForm = this.nuevaMatricula();

  metodosPago = ['Efectivo', 'Transferencia', 'Yape', 'Plin', 'Tarjeta de crédito', 'Tarjeta de débito'];

  constructor(
    private matriculaService: DatosServiceMatricula,
    private gradoService: DatosServicegrado,
    private seccionService: DatosServiceSeccion,
    private tutorService: DatosServicetutor
  ) {}

  ngOnInit(): void {
    this.cargarMatriculas();
    this.cargarGrados();
    this.cargarSecciones();
    this.cargarTutores();
  }

  nuevaMatricula(): MatriculaForm {
    const hoy = new Date().toISOString().split('T')[0];
    const finAnio = new Date().getFullYear() + '-12-31';
    return {
      id: null,
      nombres: '',
      apellidos: '',
      dni: '',
      fechaNacimiento: '',
      idGrado: null,
      idSeccion: null,
      idTutor: null,
      fechaMatricula: hoy,
      fechaFinMatricula: finAnio,
      metodoPago: '',
      montoPagado: null
    };
  }

  cargarMatriculas(): void {
    this.matriculaService.getMatriculas().subscribe({
      next: (data) => {
        this.matriculas = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar matrículas:', err);
        this.cargando = false;
      }
    });
  }

  cargarGrados(): void {
    this.gradoService.getDatos().subscribe({
      next: (grados) => this.grados = grados,
      error: (error) => console.error(error)
    });
  }

  cargarSecciones(): void {
    this.seccionService.getDatos().subscribe({
      next: (secciones) => this.secciones = secciones,
      error: (error) => console.error(error)
    });
  }

  cargarTutores(): void {
    this.tutorService.getDatos().subscribe({
      next: (tutores) => this.tutores = tutores,
      error: (error) => console.error(error)
    });
  }

  abrirModalRegistro(): void {
    this.modoEdicion = false;
    this.mensaje = '';
    this.matricula = this.nuevaMatricula();
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.matricula = this.nuevaMatricula();
  }

  editarMatricula(m: MatriculaDatos): void {
    this.modoEdicion = true;
    this.mensaje = '';
    this.mostrarModal = true;

    this.matricula = {
      id: m.id ?? null,
      nombres: m.nombres,
      apellidos: m.apellidos,
      dni: m.dni,
      fechaNacimiento: m.fechaNacimiento,
      idGrado: m.grado?.id ?? null,
      idSeccion: m.seccion?.id ?? null,
      idTutor: m.tutor?.id ?? null,
      fechaMatricula: m.fechaMatricula ?? '',
      fechaFinMatricula: m.fechaFinMatricula ?? '',
      metodoPago: m.metodoPago ?? '',
      montoPagado: m.montoPagado ?? null
    };
  }

  guardarMatricula(): void {
    if (
      !this.matricula.nombres ||
      !this.matricula.apellidos ||
      !this.matricula.dni ||
      !this.matricula.fechaNacimiento ||
      !this.matricula.idGrado ||
      !this.matricula.idSeccion ||
      !this.matricula.idTutor
    ) {
      this.mensaje = 'Complete todos los campos obligatorios.';
      return;
    }

    const matriculaEnviar: MatriculaDatos = {
      id: this.matricula.id ?? undefined,
      nombres: this.matricula.nombres,
      apellidos: this.matricula.apellidos,
      dni: this.matricula.dni,
      fechaNacimiento: this.matricula.fechaNacimiento,
      grado: { id: this.matricula.idGrado },
      seccion: { id: this.matricula.idSeccion },
      tutor: { id: this.matricula.idTutor },
      fechaMatricula: this.matricula.fechaMatricula || undefined,
      fechaFinMatricula: this.matricula.fechaFinMatricula || undefined,
      metodoPago: this.matricula.metodoPago || undefined,
      montoPagado: this.matricula.montoPagado ?? undefined
    };

    if (this.modoEdicion && this.matricula.id) {
      this.matriculaService.actualizarMatricula(this.matricula.id, matriculaEnviar).subscribe({
        next: () => {
          this.mensaje = 'Matrícula actualizada correctamente.';
          this.cerrarModal();
          this.cargarMatriculas();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al actualizar la matrícula.';
        }
      });
    } else {
      this.matriculaService.crearMatricula(matriculaEnviar).subscribe({
        next: () => {
          this.mensaje = 'Matrícula registrada correctamente.';
          this.cerrarModal();
          this.cargarMatriculas();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al registrar matrícula. Verifique que el DNI no esté repetido.';
        }
      });
    }
  }

  normalizarTexto(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  get filtrados(): MatriculaDatos[] {
    const filtro = this.normalizarTexto(this.filtro);
    if (!filtro) return this.matriculas;
    return this.matriculas.filter(m => {
      const texto = this.normalizarTexto(
        `${m.nombres} ${m.apellidos} ${m.dni} ${m.metodoPago || ''}`
      );
      return texto.includes(filtro);
    });
  }

  get paginados(): MatriculaDatos[] {
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

  getColor(index: number): string {
    const colors = ['#6366f1', '#7c3aed', '#0891b2', '#059669', '#d97706'];
    return colors[index % colors.length];
  }

  getIconoMetodoPago(metodo: string): string {
    const iconos: { [key: string]: string } = {
      'Efectivo': 'payments',
      'Transferencia': 'account_balance',
      'Yape': 'phone_android',
      'Plin': 'phone_android',
      'Tarjeta de crédito': 'credit_card',
      'Tarjeta de débito': 'credit_card'
    };
    return iconos[metodo] || 'attach_money';
  }
}