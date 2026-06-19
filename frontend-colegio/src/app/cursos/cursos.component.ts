import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatosService } from '../services/datos.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.css']
})
export class CursosComponent implements OnInit {
  cursos: any[] = [];
  
  // Catálogos para el formulario
  listaCursos: any[] = [];
  listaDocentes: any[] = [];
  listaNiveles: any[] = [];

  // Modal State
  mostrarModal: boolean = false;
  modoEdicion: boolean = false;
  
  // Modelo actual
  cursoSeleccionado: any = {
    id: null,
    curso: { id: undefined },
    docente: { id: undefined },
    nivel: { id: undefined },
    horas: null,
    estado: 1
  };

  private apiUrl = 'https://colegio-helen-school-production.up.railway.app/api/curso-docente';

  constructor(private datosService: DatosService, private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.cargarCatalogos();
  }

  cargarDatos() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.cursos = data;
      },
      error: (e) => console.error("Error al cargar asignaciones de cursos", e)
    });
  }

  cargarCatalogos() {
    this.datosService.getCursos().subscribe(data => this.listaCursos = data);
    this.datosService.getDocentes().subscribe(data => this.listaDocentes = data);
    this.datosService.getNiveles().subscribe(data => this.listaNiveles = data);
  }

  getDocentesUnicosCount() {
    const docentesIds = new Set(this.cursos.map(c => c.docente?.id));
    return docentesIds.size;
  }

  abrirModalNuevo() {
    this.modoEdicion = false;
    this.cursoSeleccionado = {
      id: null,
      curso: { id: undefined },
      docente: { id: undefined },
      nivel: { id: undefined },
      horas: null,
      estado: 1
    };
    this.mostrarModal = true;
  }

  abrirModalEdicion(cursoDocente: any) {
    this.modoEdicion = true;
    // Hacemos una copia profunda sencilla
    this.cursoSeleccionado = JSON.parse(JSON.stringify(cursoDocente));
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
  }

  guardar() {
    if (!this.cursoSeleccionado.curso.id || !this.cursoSeleccionado.docente.id || !this.cursoSeleccionado.nivel.id || !this.cursoSeleccionado.horas) {
      alert("Por favor, complete todos los campos requeridos.");
      return;
    }

    if (this.modoEdicion) {
      this.http.post(this.apiUrl, this.cursoSeleccionado).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarDatos();
        },
        error: (e) => {
          console.error("Error al actualizar", e);
          alert("Ocurrió un error al actualizar.");
        }
      });
    } else {
      this.http.post(this.apiUrl, this.cursoSeleccionado).subscribe({
        next: () => {
          this.cerrarModal();
          this.cargarDatos();
        },
        error: (e) => {
          console.error("Error al crear", e);
          alert("Ocurrió un error al guardar.");
        }
      });
    }
  }

  // Utilidades Visuales
  getIniciales(nombres: string, apellidos: string): string {
    const n = nombres ? nombres.charAt(0) : '';
    const a = apellidos ? apellidos.charAt(0) : '';
    return (n + a).toUpperCase();
  }

  getNivelColorClass(nivelNombre: string): string {
    const lower = nivelNombre?.toLowerCase() || '';
    if (lower.includes('primaria')) return 'bg-tertiary-fixed/30 text-on-tertiary-fixed-variant';
    if (lower.includes('secundaria')) return 'bg-primary-fixed/30 text-on-primary-fixed-variant';
    return 'bg-surface-container-high text-on-surface';
  }

  getNivelTextColorClass(nivelNombre: string): string {
    const lower = nivelNombre?.toLowerCase() || '';
    if (lower.includes('primaria')) return 'text-tertiary';
    if (lower.includes('secundaria')) return 'text-primary';
    return 'text-on-surface-variant';
  }
}
