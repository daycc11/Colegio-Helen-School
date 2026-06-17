import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { DatosService, DatosServicegrado, DatosServicetutor } from '../datos.service';
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
  totalTutores = 0;
  nombreUsuario = '';
  fechaHoy = '';

  barData = [
    { mes: 'Feb', altura: 40, color: '#a5b4fc' },
    { mes: 'Mar', altura: 60, color: '#818cf8' },
    { mes: 'Abr', altura: 85, color: '#6366f1' },
    { mes: 'May', altura: 75, color: '#6366f1' },
    { mes: 'Jun', altura: 50, color: '#818cf8' },
    { mes: 'Jul', altura: 30, color: '#a5b4fc' },
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
    private authService:   AuthService
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
      next: (data) => this.totalAlumnos = data.length,
      error: () => this.totalAlumnos = 0
    });

    this.gradoService.getDatos().subscribe({
      next: (data) => this.totalGrados = data.length,
      error: () => this.totalGrados = 0
    });

    this.tutorService.getDatos().subscribe({
      next: (data) => this.totalTutores = data.length,
      error: () => this.totalTutores = 0
    });
  }
}