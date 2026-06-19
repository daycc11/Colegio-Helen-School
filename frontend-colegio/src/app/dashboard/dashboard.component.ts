import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DatosService, DatosServicegrado, DatosServicetutor, DatosServiceDocente, DatosServiceMatricula } from '../datos.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  totalAlumnos = 0;
  totalGrados  = 0;
  totalDocentes = 0;
  totalTutores = 0;
  nombreUsuario = '';
  fechaHoy = '';

  barData = [
    { mes: 'Feb', altura: 40, color: '#a5b4fc', cantidad: 0 },
    { mes: 'Mar', altura: 60, color: '#818cf8', cantidad: 0 },
    { mes: 'Abr', altura: 85, color: '#6366f1', cantidad: 0 },
    { mes: 'May', altura: 75, color: '#6366f1', cantidad: 0 },
    { mes: 'Jun', altura: 50, color: '#818cf8', cantidad: 0 },
    { mes: 'Jul', altura: 30, color: '#a5b4fc', cantidad: 0 },
  ];

  niveles = [
    { nombre: 'Primaria',     porcentaje: 45, color: '#6366f1' },
    { nombre: 'Secundaria',   porcentaje: 35, color: '#7c3aed' },
    { nombre: 'Bachillerato', porcentaje: 20, color: '#0891b2' },
  ];

  constructor(
    private alumnoService: DatosService,
    private gradoService:  DatosServicegrado,
    private tutorService:  DatosServicetutor,
    private docenteService: DatosServiceDocente,
    private authService:   AuthService,
    private matriculaService: DatosServiceMatricula
  ) {}

  ngOnInit(): void {
    // Nombre del usuario actual
    const u = this.authService.getUsuario();
    this.nombreUsuario = u ? u.nombres : 'Usuario';

    // Fecha en español
    this.fechaHoy = new Date().toLocaleDateString('es-PE', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

    this.alumnoService.getDatos().subscribe({
      next: (data) => {
        this.totalAlumnos = data.length;
        
        // --- Cálculo de Evolución de Matrículas (Meses) ---
        // Asumiendo que el año actual es el relevante. 
        const yearActual = new Date().getFullYear();
        const conteoMeses: { [key: number]: number } = {};
        for (let i = 0; i < 12; i++) conteoMeses[i] = 0; // Inicializar

        data.forEach(alumno => {
          const alum = alumno as any;
          let f = alum.fechaMatricula ? new Date(alum.fechaMatricula) : new Date(alum.fechaNacimiento); // fallback si no hay fechaMatricula
          // Si por zona horaria es inválido, evitamos error
          if (!isNaN(f.getTime())) {
            conteoMeses[f.getMonth()]++;
          }
        });

        // Nombres de meses cortos
        const nombreMeses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        // Obtener los últimos 6 meses con datos, o los primeros 6 del año. 
        // Para simplificar, mostraremos los meses del 1 al 6 (Ene-Jun) o los meses actuales.
        // Vamos a mostrar los 6 meses hasta el mes actual.
        const mesActual = new Date().getMonth();
        const ultimos6Meses = [];
        for (let i = 5; i >= 0; i--) {
          let m = mesActual - i;
          if (m < 0) m += 12; // Mes del año pasado
          ultimos6Meses.push(m);
        }

        const maxMatriculas = Math.max(...ultimos6Meses.map(m => conteoMeses[m]), 1);

        this.barData = ultimos6Meses.map((m, index) => {
          const cantidad = conteoMeses[m];
          // Altura en porcentaje (min 10% para que se vea algo)
          const altura = Math.max(10, Math.round((cantidad / maxMatriculas) * 100));
          return {
            mes: nombreMeses[m],
            altura: altura,
            color: index % 2 === 0 ? '#a5b4fc' : '#818cf8',
            cantidad: cantidad
          };
        });

        // La distribución ahora se calcula con matriculas independientemente
      },
      error: () => this.totalAlumnos = 0
    });

    this.matriculaService.getMatriculas().subscribe({
      next: (matriculas) => {
        let primaria = 0;
        let secundaria = 0;
        let bachillerato = 0;
        let totalValidos = 0;

        matriculas.forEach(m => {
          if (m.aula?.gradoNivelSeccion?.nivel?.nombre) {
            const n = m.aula.gradoNivelSeccion.nivel.nombre.toLowerCase();
            if (n.includes('primaria')) primaria++;
            else if (n.includes('secundaria')) secundaria++;
            else bachillerato++; // Asumimos bachillerato o inicial a los demás
            totalValidos++;
          }
        });

        if (totalValidos === 0) totalValidos = 1; // Evitar división por cero

        this.niveles = [
          { nombre: 'Primaria', porcentaje: Math.round((primaria / totalValidos) * 100), color: '#6366f1' },
          { nombre: 'Secundaria', porcentaje: Math.round((secundaria / totalValidos) * 100), color: '#7c3aed' },
          { nombre: 'Bachillerato', porcentaje: Math.round((bachillerato / totalValidos) * 100), color: '#0891b2' }
        ];
      },
    });
    this.gradoService.getDatos().subscribe({
      next: (data) => this.totalGrados = data.length,
      error: () => this.totalGrados = 0
    });

    this.docenteService.getDatos().subscribe({
      next: (data) => this.totalDocentes = data.length,
      error: () => this.totalDocentes = 0
    });

    this.tutorService.getDatos().subscribe({
      next: (data) => this.totalTutores = data.length,
      error: () => this.totalTutores = 0
    });
  }
}