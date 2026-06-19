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
  
  turnoActual: 'Mañana' | 'Tarde' | 'Noche' = 'Mañana';

  bloquesManana = [
    { inicio: '07:30', fin: '10:29', label: '07:30 AM', isReceso: false },
    { inicio: '10:30', fin: '11:29', label: '10:30 AM', isReceso: true },
    { inicio: '11:30', fin: '13:00', label: '11:30 AM', isReceso: false }
  ];

  bloquesTarde = [
    { inicio: '13:30', fin: '15:29', label: '01:30 PM', isReceso: false },
    { inicio: '15:30', fin: '16:29', label: '03:30 PM', isReceso: true },
    { inicio: '16:30', fin: '18:00', label: '04:30 PM', isReceso: false }
  ];

  bloquesNoche = [
    { inicio: '18:30', fin: '20:29', label: '06:30 PM', isReceso: false },
    { inicio: '20:30', fin: '20:59', label: '08:30 PM', isReceso: true },
    { inicio: '21:00', fin: '22:30', label: '09:00 PM', isReceso: false }
  ];

  get bloquesHora() {
    if (this.turnoActual === 'Mañana') return this.bloquesManana;
    if (this.turnoActual === 'Tarde') return this.bloquesTarde;
    return this.bloquesNoche;
  }

  cambiarTurno(turno: 'Mañana' | 'Tarde' | 'Noche') {
    this.turnoActual = turno;
  }

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
