import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DatosServiceMatricula, DatosService } from '../datos.service';
import { AulaService } from '../services/aula.service';
import { Datos as AlumnoDatos } from '../alumno/datos';
import { Aula } from '../services/aula.service';

interface MatriculaForm {
  id?: number | null;
  idAlumno: number | null;
  idAula: number | null;
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

  cargando = true;
  filtro = '';

  paginaActual = 1;
  porPagina = 8;

  mostrarModal = false;
  modoEdicion = false;
  mensaje = '';
  mensajeError = false;

  matricula: MatriculaForm = this.nuevaMatricula();

  constructor(
    private matriculaService: DatosServiceMatricula,
    private alumnoService: DatosService,
    private aulaService: AulaService
  ) {}

  ngOnInit(): void {
    this.cargarMatriculas();
    this.cargarAlumnos();
    this.cargarAulas();
  }

  nuevaMatricula(): MatriculaForm {
    return {
      id: null,
      idAlumno: null,
      idAula: null
    };
  }

  cargarMatriculas(): void {
    this.matriculaService.getMatriculas().subscribe({
      next: (data) => {
        this.matriculas = data;
        this.cargando = false;
        if (this.matriculas.length === 0) {
          this.mensaje = 'No hay Registro de Matriculas';
          this.mensajeError = true;
        } else {
          this.mensaje = '';
        }
      },
      error: (err) => {
        console.error('Error al cargar matrículas:', err);
        this.mensaje = 'No hay Registro de Matriculas';
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

  guardarMatricula(): void {
    if (!this.matricula.idAlumno || !this.matricula.idAula) {
      this.mensaje = 'Seleccione un estudiante y un aula.';
      this.mensajeError = true;
      return;
    }

    const matriculaEnviar = {
      id: this.matricula.id ?? undefined,
      alumno: { id: this.matricula.idAlumno },
      aula: { id: this.matricula.idAula }
    };

    if (this.modoEdicion && this.matricula.id) {
      this.matriculaService.actualizarMatricula(this.matricula.id, matriculaEnviar).subscribe({
        next: () => {
          this.mensaje = 'Matrícula actualizada correctamente.';
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
      this.matriculaService.crearMatricula(matriculaEnviar).subscribe({
        next: () => {
          this.mensaje = 'Matrícula registrada correctamente.';
          this.mensajeError = false;
          this.cerrarModal();
          this.cargarMatriculas();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al registrar matrícula.';
          this.mensajeError = true;
        }
      });
    }
  }

  editarMatricula(m: any): void {
    this.modoEdicion = true;
    this.mensaje = '';
    this.mostrarModal = true;

    this.matricula = {
      id: m.id ?? null,
      idAlumno: m.alumno?.id ?? null,
      idAula: m.aula?.id ?? null
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
        `${m.alumno?.nombres} ${m.alumno?.apellidos} ${m.alumno?.dni}`
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