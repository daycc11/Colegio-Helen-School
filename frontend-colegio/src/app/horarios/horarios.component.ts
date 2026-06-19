import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
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
  diasSemanaList: any[] = [];
  cursosDocente: any[] = [];

  filtroNivel: number | null = null;
  filtroGrado: number | null = null;
  filtroSeccion: number | null = null;
  filtroDocente: number | null = null;

  horarios: Horario[] = [];
  errorMsj: string | null = null;
  successMsj: string | null = null;
  cargando = false;

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

  // ── Modal Nuevo Bloque ──
  mostrarModal = false;
  guardando = false;
  conflictoMsg: string | null = null;

  nuevoHorario: any = {
    idCursoDocente: null,
    idAula: null,
    idDiaSemana: null,
    horaInicio: '',
    horaFin: ''
  };

  // ── Confirm Delete ──
  mostrarConfirmEliminar = false;
  horarioAEliminar: Horario | null = null;

  private readonly API = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(
    private horarioService: HorarioService,
    private aulaService: AulaService,
    private datosService: DatosService,
    private http: HttpClient
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
    this.aulaService.getTodasAulas().subscribe(res => this.aulas = res);
    this.http.get<any[]>(`${this.API}/diaSemana`).subscribe(res => this.diasSemanaList = res);
    this.http.get<any[]>(`${this.API}/curso-docente`).subscribe(res => this.cursosDocente = res);
  }

  cambiarVista(vista: 'General' | 'Docente' | 'Estudiante') {
    this.vistaActual = vista;
    this.filtroDocente = null;
    this.filtroNivel = null;
    this.filtroGrado = null;
    this.filtroSeccion = null;
    this.cargarHorarios();
  }

  cargarHorarios() {
    this.errorMsj = null;
    this.cargando = true;

    if (this.vistaActual === 'General') {
      this.horarioService.listarTodos().subscribe(
        res => { this.horarios = res; this.cargando = false; },
        err => { console.error(err); this.errorMsj = 'No hay Registro de Horarios'; this.cargando = false; }
      );
    } else if (this.vistaActual === 'Docente') {
      if (this.filtroDocente) {
        this.horarioService.listarPorDocente(this.filtroDocente).subscribe(
          res => { this.horarios = res; this.cargando = false; },
          err => { console.error(err); this.errorMsj = 'No hay Registro de Horarios'; this.cargando = false; }
        );
      } else {
        this.horarios = [];
        this.cargando = false;
      }
    } else if (this.vistaActual === 'Estudiante') {
      if (this.filtroNivel && this.filtroGrado && this.filtroSeccion) {
        this.horarioService.listarPorAula(this.filtroNivel, this.filtroGrado, this.filtroSeccion).subscribe(
          res => { this.horarios = res; this.cargando = false; },
          err => { console.error(err); this.errorMsj = 'No hay Registro de Horarios'; this.cargando = false; }
        );
      } else {
        this.horarios = [];
        this.cargando = false;
      }
    }
  }

  getHorariosPorBloqueYDia(horaInicio: string, nombreDia: string): Horario[] {
    return this.horarios.filter(h =>
      h.horaInicio.startsWith(horaInicio) && h.diaSemana.nombre === nombreDia
    );
  }

  nuevoBloque(horaInicio?: string, diaNombre?: string) {
    this.conflictoMsg = null;
    this.nuevoHorario = {
      idCursoDocente: null,
      idAula: null,
      idDiaSemana: null,
      horaInicio: horaInicio || '',
      horaFin: ''
    };

    if (diaNombre) {
      const dia = this.diasSemanaList.find(d => d.nombre === diaNombre);
      if (dia) this.nuevoHorario.idDiaSemana = dia.id;
    }

    if (horaInicio) {
      const bloque = this.bloquesHora.find(b => b.inicio === horaInicio && !b.isReceso);
      if (bloque) this.nuevoHorario.horaFin = bloque.fin;
    }

    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.conflictoMsg = null;
  }

  validarYGuardar() {
    this.conflictoMsg = null;

    if (!this.nuevoHorario.idCursoDocente || !this.nuevoHorario.idAula ||
        !this.nuevoHorario.idDiaSemana || !this.nuevoHorario.horaInicio || !this.nuevoHorario.horaFin) {
      this.conflictoMsg = 'Por favor completa todos los campos.';
      return;
    }

    const diaSeleccionado = this.diasSemanaList.find(d => d.id == this.nuevoHorario.idDiaSemana);
    if (!diaSeleccionado) { this.conflictoMsg = 'Día inválido.'; return; }

    const cdSeleccionado = this.cursosDocente.find(cd => cd.id == this.nuevoHorario.idCursoDocente);
    if (!cdSeleccionado) { this.conflictoMsg = 'Asignación docente-curso inválida.'; return; }

    const idDocenteNuevo = cdSeleccionado.docente?.id;
    const idAulaNueva = Number(this.nuevoHorario.idAula);
    const diaNombreNuevo = diaSeleccionado.nombre;
    const horaInicioNueva = this.nuevoHorario.horaInicio;
    const horaFinNueva = this.nuevoHorario.horaFin;

    // Conflicto: docente ya tiene clase en ese horario
    const conflictoDocente = this.horarios.find(h => {
      if (h.diaSemana.nombre !== diaNombreNuevo) return false;
      if (h.cursoDocente.docente.id !== idDocenteNuevo) return false;
      return this.horasSeSolapan(h.horaInicio, h.horaFin, horaInicioNueva, horaFinNueva);
    });

    if (conflictoDocente) {
      const c = conflictoDocente;
      this.conflictoMsg = `⚠ Conflicto: ${c.cursoDocente.docente.nombres} ${c.cursoDocente.docente.apellidos} ya dicta "${c.cursoDocente.curso.nombre}" el ${diaNombreNuevo} de ${c.horaInicio} a ${c.horaFin}.`;
      return;
    }

    // Conflicto: aula ya ocupada en ese horario
    const conflictoAula = this.horarios.find(h => {
      if (h.diaSemana.nombre !== diaNombreNuevo) return false;
      if (h.aula.id !== idAulaNueva) return false;
      return this.horasSeSolapan(h.horaInicio, h.horaFin, horaInicioNueva, horaFinNueva);
    });

    if (conflictoAula) {
      const c = conflictoAula;
      this.conflictoMsg = `⚠ Conflicto: El aula ya tiene "${c.cursoDocente.curso.nombre}" el ${diaNombreNuevo} de ${c.horaInicio} a ${c.horaFin}.`;
      return;
    }

    this.guardando = true;
    const payload = {
      cursoDocente: { id: this.nuevoHorario.idCursoDocente },
      aula: { id: this.nuevoHorario.idAula },
      diaSemana: { id: this.nuevoHorario.idDiaSemana },
      horaInicio: this.nuevoHorario.horaInicio,
      horaFin: this.nuevoHorario.horaFin
    };

    this.horarioService.guardar(payload).subscribe(
      () => {
        this.guardando = false;
        this.mostrarModal = false;
        this.successMsj = '✓ Horario registrado correctamente.';
        this.cargarHorarios();
        setTimeout(() => this.successMsj = null, 3500);
      },
      err => {
        this.guardando = false;
        this.conflictoMsg = 'Error al guardar el horario. Intenta de nuevo.';
        console.error(err);
      }
    );
  }

  confirmarEliminar(h: Horario, event: Event) {
    event.stopPropagation();
    this.horarioAEliminar = h;
    this.mostrarConfirmEliminar = true;
  }

  ejecutarEliminar() {
    if (!this.horarioAEliminar?.id) return;
    this.horarioService.eliminar(this.horarioAEliminar.id).subscribe(
      () => {
        this.mostrarConfirmEliminar = false;
        this.horarioAEliminar = null;
        this.successMsj = '✓ Horario eliminado.';
        this.cargarHorarios();
        setTimeout(() => this.successMsj = null, 3000);
      },
      err => {
        console.error(err);
        this.errorMsj = 'Error al eliminar el horario.';
        this.mostrarConfirmEliminar = false;
      }
    );
  }

  cancelarEliminar() {
    this.mostrarConfirmEliminar = false;
    this.horarioAEliminar = null;
  }

  private horasSeSolapan(ini1: string, fin1: string, ini2: string, fin2: string): boolean {
    const toMin = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    };
    const s1 = toMin(ini1), e1 = toMin(fin1);
    const s2 = toMin(ini2), e2 = toMin(fin2);
    return s1 < e2 && s2 < e1;
  }

  getNombreAula(aula: Aula | undefined): string {
    if (!aula?.gradoNivelSeccion) return 'Aula';
    const gns = aula.gradoNivelSeccion;
    return `${gns.nivel.nombre} - ${gns.grado.nombre} "${gns.seccion.nombre}"`;
  }
}
