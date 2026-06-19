import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AulaService, Aula, AnioEscolar, Turno } from '../services/aula.service';

@Component({
  selector: 'app-aulas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aulas.component.html',
  styleUrls: ['./aulas.component.css']
})
export class AulasComponent implements OnInit {

  aniosEscolares: AnioEscolar[] = [];
  turnos: Turno[] = [];
  aulas: Aula[] = [];

  anioSeleccionado: AnioEscolar | null = null;
  turnoSeleccionadoId: number | string = 'Todos los turnos';

  // Stats
  totalEstudiantes = 0;
  seccionesActivas = 0;
  gradosManana = 0;
  gradosTarde = 0;

  constructor(private aulaService: AulaService) {}

  ngOnInit(): void {
    this.cargarDatosBasicos();
  }

  cargarDatosBasicos(): void {
    this.aulaService.getAniosEscolares().subscribe(anios => {
      this.aniosEscolares = anios;
      // Por defecto seleccionar el activo o el primero
      if (this.aniosEscolares.length > 0) {
        this.anioSeleccionado = this.aniosEscolares.find(a => a.activo) || this.aniosEscolares[0];
        this.cargarAulas();
      }
    });

    this.aulaService.getTurnos().subscribe(turnos => {
      this.turnos = turnos;
    });
  }

  seleccionarAnio(anio: AnioEscolar): void {
    this.anioSeleccionado = anio;
    this.cargarAulas();
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
    this.totalEstudiantes = 0; // Se actualizará si traemos matrículas por aula
    
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
    // Falso calculo basado en un estático de matriculados vs capacidad
    // Asumimos 24/25 por ahora para no romper diseño
    return Math.round((24 / aula.capacidad) * 100);
  }
}
