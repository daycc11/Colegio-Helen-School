import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulaService, Aula, AnioEscolar, Turno } from '../services/aula.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aulas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {

  aniosEscolares: AnioEscolar[] = [];
  turnos: Turno[] = [];
  aulas: Aula[] = [];

  listaGradoNivelSeccion: any[] = [];
  auxiliares: any[] = [];

  anioSeleccionado: AnioEscolar | null = null;
  nivelSeleccionadoId: number | null = null;
  gradoSeleccionadoId: number | null = null;
  seccionSeleccionadaId: number | string = 'Todas';
  turnoSeleccionadoId: number | string = 'Todos los turnos';

  // Stats
  totalEstudiantes = 0;
  seccionesActivas = 0;
  gradosManana = 0;
  gradosTarde = 0;

  // Modal y Formulario
  mostrarModal = false;
  aulaForm: FormGroup;
  aulaSeleccionadaId: number | null = null;

  // Catalogos extraidos
  nivelesUnicos: any[] = [];
  gradosPorNivel: any[] = [];
  seccionesUnicas: any[] = [];

  constructor(
    private aulaService: AulaService, 
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.aulaForm = this.fb.group({
      gradoNivelSeccion: ['', Validators.required],
      turno: ['', Validators.required],
      anioEscolar: ['', Validators.required],
      auxiliar: ['', Validators.required],
      capacidad: [25, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatosBasicos();
    this.route.queryParams.subscribe(params => {
      if (params['action'] === 'new') {
        setTimeout(() => this.abrirModal(), 0);
      }
    });
  }

  cargarDatosBasicos(): void {
    this.aulaService.getAniosEscolares().subscribe(anios => {
      this.aniosEscolares = anios;
      if (this.aniosEscolares.length > 0) {
        this.anioSeleccionado = this.aniosEscolares.find(a => a.activo) || this.aniosEscolares[0];
        this.cargarAulas();
        this.aulaForm.patchValue({ anioEscolar: this.anioSeleccionado.id });
      }
    });

    this.aulaService.getTurnos().subscribe(turnos => {
      this.turnos = turnos;
    });

    this.aulaService.getGradoNivelSecciones().subscribe(data => {
      this.listaGradoNivelSeccion = data;
      this.extraerCatalogos();
    });
    this.aulaService.getAuxiliares().subscribe(aux => this.auxiliares = aux);
    
    // Obtener todos los niveles directamente
    this.aulaService.getNiveles().subscribe(niveles => {
      this.nivelesUnicos = niveles;
      if (this.nivelesUnicos.length > 0 && !this.nivelSeleccionadoId) {
        this.seleccionarNivel(this.nivelesUnicos[0]);
      }
    });
  }

  extraerCatalogos() {
    const seccionMap = new Map();
    this.listaGradoNivelSeccion.forEach(gns => {
      seccionMap.set(gns.seccion.id, gns.seccion);
    });
    this.seccionesUnicas = Array.from(seccionMap.values());
  }

  seleccionarAnio(anio: AnioEscolar): void {
    this.anioSeleccionado = anio;
    this.cargarAulas();
    this.aulaForm.patchValue({ anioEscolar: anio.id });
  }

  seleccionarNivel(nivel: any): void {
    this.nivelSeleccionadoId = nivel.id;
    const gradoMap = new Map();
    this.listaGradoNivelSeccion.filter(gns => gns.nivel.id === nivel.id).forEach(gns => {
      gradoMap.set(gns.grado.id, gns.grado);
    });
    this.gradosPorNivel = Array.from(gradoMap.values());
    if (this.gradosPorNivel.length > 0) {
      this.gradoSeleccionadoId = this.gradosPorNivel[0].id;
    } else {
      this.gradoSeleccionadoId = null;
    }
    this.calcularStats();
  }

  seleccionarGrado(gradoId: number): void {
    this.gradoSeleccionadoId = gradoId;
  }

  getGradoAbreviado(nombre: string): string {
    const map: any = {
      'primero': '1ro',
      'segundo': '2do',
      'tercero': '3ro',
      'cuarto': '4to',
      'quinto': '5to',
      'sexto': '6to',
      'septimo': '7mo',
      'octavo': '8vo',
      'noveno': '9no',
      'decimo': '10mo',
      'inicial 3 años': '3 Años',
      'inicial 4 años': '4 Años',
      'inicial 5 años': '5 Años'
    };
    const key = nombre.toLowerCase().trim();
    return map[key] || nombre;
  }

  getGradoNumero(nombre: string): string {
    const map: any = {
      'primero': '1',
      'segundo': '2',
      'tercero': '3',
      'cuarto': '4',
      'quinto': '5',
      'sexto': '6',
      'septimo': '7',
      'octavo': '8',
      'noveno': '9',
      'decimo': '10',
      'inicial 3 años': '3',
      'inicial 4 años': '4',
      'inicial 5 años': '5'
    };
    const key = nombre.toLowerCase().trim();
    // Extrae el número si no está mapeado
    const regex = /\d+/;
    const match = key.match(regex);
    return map[key] || (match ? match[0] : nombre.charAt(0));
  }

  getNivelSeleccionadoNombre(): string {
    return this.nivelesUnicos.find(n => n.id === this.nivelSeleccionadoId)?.nombre || '';
  }

  getGradoSeleccionadoNombre(): string {
    return this.gradosPorNivel.find(g => g.id === this.gradoSeleccionadoId)?.nombre || '';
  }

  cargarAulas(): void {
    if (!this.anioSeleccionado) return;
    this.aulaService.getAulas(this.anioSeleccionado.id).subscribe(aulas => {
      this.aulas = aulas;
      this.calcularStats();
    });
  }

  calcularStats(): void {
    const aulasNivel = this.aulas.filter(a => a.gradoNivelSeccion.nivel.id === this.nivelSeleccionadoId);
    this.seccionesActivas = aulasNivel.filter(a => a.activo).length;
    this.totalEstudiantes = aulasNivel.reduce((acc, aula: any) => acc + (aula.matriculados || 0), 0);
    this.gradosManana = aulasNivel.filter(a => a.turno.nombre.toLowerCase().includes('mañana')).length;
    this.gradosTarde = aulasNivel.filter(a => a.turno.nombre.toLowerCase().includes('tarde')).length;
  }

  getAulasFiltradas(): Aula[] {
    return this.aulas.filter(a => {
      const matchNivel = a.gradoNivelSeccion.nivel.id === this.nivelSeleccionadoId;
      const matchGrado = a.gradoNivelSeccion.grado.id === this.gradoSeleccionadoId;
      const matchSeccion = this.seccionSeleccionadaId === 'Todas' || a.gradoNivelSeccion.seccion.id == this.seccionSeleccionadaId;
      const matchTurno = this.turnoSeleccionadoId === 'Todos los turnos' || a.turno.nombre === this.turnoSeleccionadoId;
      return matchNivel && matchGrado && matchSeccion && matchTurno;
    });
  }

  paginaActual = 1;
  porPagina = 8;

  get paginados(): Aula[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.getAulasFiltradas().slice(inicio, inicio + this.porPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.getAulasFiltradas().length / this.porPagina) || 1;
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  get inicioMostrado(): number {
    if (this.getAulasFiltradas().length === 0) return 0;
    return (this.paginaActual - 1) * this.porPagina + 1;
  }

  get finMostrado(): number {
    const fin = this.paginaActual * this.porPagina;
    return fin > this.getAulasFiltradas().length ? this.getAulasFiltradas().length : fin;
  }

  getPorcentajeOcupacion(aula: any): number {
    const matriculados = aula['matriculados'] || 0;
    if (!aula.capacidad) return 0;
    return Math.round((matriculados / aula.capacidad) * 100);
  }

  abrirModal(): void {
    this.mostrarModal = true;
    this.aulaSeleccionadaId = null;
    this.aulaForm.reset({ capacidad: 25, anioEscolar: this.anioSeleccionado?.id, activo: true });
  }

  abrirModalEdicion(aula: Aula): void {
    this.mostrarModal = true;
    this.aulaSeleccionadaId = aula.id || null;
    this.aulaForm.patchValue({
      gradoNivelSeccion: aula.gradoNivelSeccion.id,
      turno: aula.turno.id || (this.turnos.find(t => t.nombre === aula.turno.nombre)?.id),
      anioEscolar: aula.anioEscolar.id,
      auxiliar: aula.auxiliar.id,
      capacidad: aula.capacidad
    });
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.aulaSeleccionadaId = null;
    this.aulaForm.reset({ capacidad: 25, anioEscolar: this.anioSeleccionado?.id });
  }

  guardarAula(): void {
    if (this.aulaForm.invalid) {
      alert("Por favor complete todos los campos correctamente.");
      return;
    }

    const formData = this.aulaForm.value;
    const aulaData = {
      gradoNivelSeccion: { id: formData.gradoNivelSeccion },
      turno: { id: formData.turno },
      anioEscolar: { id: formData.anioEscolar },
      auxiliar: { id: formData.auxiliar },
      capacidad: formData.capacidad,
      activo: true
    };

    if (this.aulaSeleccionadaId) {
      this.aulaService.actualizarAula(this.aulaSeleccionadaId, aulaData).subscribe({
        next: () => {
          alert("Aula actualizada con éxito!");
          this.cerrarModal();
          this.cargarAulas();
        },
        error: (err) => {
          console.error("Error al actualizar aula", err);
          alert("Ocurrió un error al actualizar el aula.");
        }
      });
    } else {
      this.aulaService.guardarAula(aulaData).subscribe({
        next: () => {
          alert("Aula registrada con éxito!");
          this.cerrarModal();
          this.cargarAulas();
        },
        error: (err) => {
          console.error("Error al registrar aula", err);
          alert("Ocurrió un error al registrar el aula.");
        }
      });
    }
  }
}
