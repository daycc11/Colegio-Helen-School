import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AulaService, Aula, AnioEscolar, Turno } from '../services/aula.service';

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

  // Opciones para el formulario
  grados: any[] = [];
  niveles: any[] = [];
  secciones: any[] = [];
  auxiliares: any[] = [];

  anioSeleccionado: AnioEscolar | null = null;
  turnoSeleccionadoId: number | string = 'Todos los turnos';

  // Stats
  totalEstudiantes = 0;
  seccionesActivas = 0;
  gradosManana = 0;
  gradosTarde = 0;

  // Modal y Formulario
  mostrarModal = false;
  aulaForm: FormGroup;

  constructor(private aulaService: AulaService, private fb: FormBuilder) {
    this.aulaForm = this.fb.group({
      grado: ['', Validators.required],
      nivel: ['', Validators.required],
      seccion: ['', Validators.required],
      turno: ['', Validators.required],
      anioEscolar: ['', Validators.required],
      auxiliar: ['', Validators.required],
      capacidad: [30, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarDatosBasicos();
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

    this.aulaService.getGrados().subscribe(grados => this.grados = grados);
    this.aulaService.getNiveles().subscribe(niveles => this.niveles = niveles);
    this.aulaService.getSecciones().subscribe(secciones => this.secciones = secciones);
    this.aulaService.getAuxiliares().subscribe(aux => this.auxiliares = aux);
  }

  seleccionarAnio(anio: AnioEscolar): void {
    this.anioSeleccionado = anio;
    this.cargarAulas();
    this.aulaForm.patchValue({ anioEscolar: anio.id });
  }

  cargarAulas(): void {
    if (!this.anioSeleccionado) return;
    this.aulaService.getAulas(this.anioSeleccionado.id).subscribe(aulas => {
      this.aulas = aulas;
      this.calcularStats();
    });
  }

  calcularStats(): void {
    this.seccionesActivas = this.aulas.filter(a => a.activo).length;
    this.totalEstudiantes = 0;
    this.gradosManana = this.aulas.filter(a => a.turno.nombre.toLowerCase().includes('mañana')).length;
    this.gradosTarde = this.aulas.filter(a => a.turno.nombre.toLowerCase().includes('tarde')).length;
  }

  onTurnoFilterChange(event: any): void {
    this.turnoSeleccionadoId = event.target.value;
  }

  getAulasFiltradas(): Aula[] {
    if (this.turnoSeleccionadoId === 'Todos los turnos') {
      return this.aulas;
    }
    return this.aulas.filter(a => a.turno.nombre === this.turnoSeleccionadoId);
  }

  getPorcentajeOcupacion(aula: Aula): number {
    return Math.round((24 / aula.capacidad) * 100);
  }

  // --- LÓGICA DEL MODAL ---
  abrirModal(): void {
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.aulaForm.reset({ capacidad: 30, anioEscolar: this.anioSeleccionado?.id });
  }

  guardarAula(): void {
    if (this.aulaForm.invalid) {
      alert("Por favor complete todos los campos correctamente.");
      return;
    }

    const formData = this.aulaForm.value;
    const nuevaAula = {
      grado: { id: formData.grado },
      nivel: { id: formData.nivel },
      seccion: { id: formData.seccion },
      turno: { id: formData.turno },
      anioEscolar: { id: formData.anioEscolar },
      auxiliar: { id: formData.auxiliar }, // <-- Importante: Mapeado a auxiliar, que ahora es un Usuario en backend
      capacidad: formData.capacidad,
      activo: true
    };

    this.aulaService.guardarAula(nuevaAula).subscribe({
      next: (res) => {
        alert("Aula registrada con éxito!");
        this.cerrarModal();
        this.cargarAulas(); // Refrescar la lista
      },
      error: (err) => {
        console.error("Error al registrar aula", err);
        alert("Ocurrió un error al registrar el aula.");
      }
    });
  }
}
