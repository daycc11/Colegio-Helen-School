import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HorarioService, Horario } from '../services/horario.service';
import { AulaService, Aula } from '../services/aula.service';
import { DatosService } from '../services/datos.service';

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './horarios.component.html',
  styleUrls: ['./horarios.component.css']
})
export class HorariosComponent implements OnInit {
  vistaActual: 'General' | 'Docente' | 'Estudiante' = 'General';
  
  niveles: any[] = [];
  grados: any[] = [];
  secciones: any[] = [];
  docentes: any[] = [];
  aulas: Aula[] = [];
  
  // Filtros
  filtroNivel: number | null = null;
  filtroGrado: number | null = null;
  filtroSeccion: number | null = null;
  filtroDocente: number | null = null;
  
  horarios: Horario[] = [];
  errorMsj: string | null = null;

  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  bloquesHora = [
    { inicio: '08:00', fin: '09:30' },
    { inicio: '09:30', fin: '11:00' },
    { inicio: '11:00', fin: '11:30', isReceso: true },
    { inicio: '11:30', fin: '13:00' },
    { inicio: '13:00', fin: '14:30' }
  ];

  constructor(
    private horarioService: HorarioService,
    private aulaService: AulaService,
    private datosService: DatosService
  ) {}

  ngOnInit() {
    this.cargarDatosMaestros();
    this.cargarHorarios();
  }

  cargarDatosMaestros() {
    this.aulaService.getNiveles().subscribe(res => this.niveles = res);
    this.aulaService.getGrados().subscribe(res => this.grados = res);
    this.aulaService.getSecciones().subscribe(res => this.secciones = res);
    this.datosService.getDocentes().subscribe(res => this.docentes = res);
  }

  cambiarVista(vista: 'General' | 'Docente' | 'Estudiante') {
    this.vistaActual = vista;
    this.cargarHorarios();
  }

  cargarHorarios() {
    this.errorMsj = null;
    if (this.vistaActual === 'General') {
      this.horarioService.listarTodos().subscribe(res => {
        this.horarios = res;
      }, err => {
        console.error(err);
        this.errorMsj = "Error cargando horarios.";
      });
    } else if (this.vistaActual === 'Docente') {
      if (this.filtroDocente) {
        this.horarioService.listarPorDocente(this.filtroDocente).subscribe(res => {
          this.horarios = res;
        });
      } else {
        this.horarios = []; // Vacío si no hay docente seleccionado
      }
    } else if (this.vistaActual === 'Estudiante') {
      if (this.filtroNivel && this.filtroGrado && this.filtroSeccion) {
        this.horarioService.listarPorAula(this.filtroNivel, this.filtroGrado, this.filtroSeccion).subscribe(res => {
          this.horarios = res;
        });
      } else {
        this.horarios = []; // Vacío
      }
    }
  }

  getHorariosPorBloqueYDia(horaInicio: string, nombreDia: string): Horario[] {
    return this.horarios.filter(h => h.horaInicio.startsWith(horaInicio) && h.diaSemana.nombre === nombreDia);
  }

  nuevoBloque() {
    // Implementación futura: Abrir modal para registrar
    alert("Función para abrir el modal de Nuevo Bloque");
  }
}
