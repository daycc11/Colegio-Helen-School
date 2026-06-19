import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
  NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs';
import { AuthService, UsuarioLogueado } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `

    <!-- PÁGINAS SIN SIDEBAR: login, registro, home -->
    <ng-container *ngIf="!mostrarLayout">
      <router-outlet></router-outlet>
    </ng-container>

    <!-- SISTEMA CON SIDEBAR -->
    <ng-container *ngIf="mostrarLayout">
      <div class="layout">

        <aside class="sidebar">
          <div class="brand">
            <div class="brand-icon">
              <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1">school</span>
            </div>
            <div>
              <h2>Gestión Académica</h2>
              <p>{{ usuario?.rol || 'Administrador' }}</p>
            </div>
          </div>

          <a routerLink="/matriculas" class="new-button">
            <span class="material-symbols-outlined" style="font-size:1rem">add_circle</span>
            Nueva Matrícula
          </a>

          <nav class="menu">
            <a routerLink="/dashboard" routerLinkActive="active">
              <span class="material-symbols-outlined">dashboard</span> Panel Control
            </a>
            <a routerLink="/alumno" routerLinkActive="active">
              <span class="material-symbols-outlined">groups</span> Estudiantes
            </a>
            <a routerLink="/grado" routerLinkActive="active">
              <span class="material-symbols-outlined">assignment_ind</span> Asignación Académica
            </a>
            <a routerLink="/aulas" routerLinkActive="active" class="font-semibold text-primary">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">domain</span> Grados y Secciones
            </a>
            <a routerLink="/tutor" routerLinkActive="active">
              <span class="material-symbols-outlined">family_restroom</span> Tutores
            </a>
            <a routerLink="/docente" routerLinkActive="active">
              <span class="material-symbols-outlined">person_celebrate</span> Docentes
            </a>
            <a routerLink="/matriculas" routerLinkActive="active">
              <span class="material-symbols-outlined">edit_note</span> Matrículas
            </a>
            <a routerLink="/pagos" routerLinkActive="active">
              <span class="material-symbols-outlined">payments</span> Pagos
            </a>
            <a routerLink="/reportes" routerLinkActive="active">
              <span class="material-symbols-outlined">bar_chart</span> Reportes
            </a>
          </nav>

          <!-- Info usuario + Logout -->
          <div class="sidebar-footer">
            <div class="user-info" *ngIf="usuario">
              <div class="user-avatar">{{ getIniciales() }}</div>
              <div class="user-details">
                <span class="user-name">{{ usuario.nombres }} {{ usuario.apellidos }}</span>
                <span class="user-role">{{ usuario.rol }}</span>
              </div>
            </div>
            <button class="btn-logout" (click)="cerrarSesion()">
              <span class="material-symbols-outlined">logout</span>
              Cerrar Sesión
            </button>
          </div>
        </aside>

        <section class="main-area">

          <header class="topbar">
            <h1>HELEN SCHOOL</h1>
            <div class="topbar-actions">
              <button class="icon-button">
                <span class="material-symbols-outlined">notifications</span>
              </button>
              <button class="icon-button">
                <span class="material-symbols-outlined">help</span>
              </button>
              <div class="avatar">{{ getIniciales() }}</div>
            </div>
          </header>

          <main class="content">
            <router-outlet></router-outlet>
          </main>

        </section>

      </div>
    </ng-container>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-colegio';
  mostrarLayout = false;
  usuario: UsuarioLogueado | null = null;

  // Rutas donde NO se muestra el sidebar
  private rutasSinLayout = ['/', '/login', '/registro', '/home', ''];

  constructor(private router: Router, private authService: AuthService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const ruta = event.urlAfterRedirects;
        this.mostrarLayout = !this.rutasSinLayout.includes(ruta);
      });
  }

  ngOnInit(): void {
    // Suscribirse a cambios del usuario logueado
    this.authService.usuario$.subscribe(u => {
      this.usuario = u;
    });
  }

  getIniciales(): string {
    if (!this.usuario) return 'U';
    const n = this.usuario.nombres?.charAt(0) || '';
    const a = this.usuario.apellidos?.charAt(0) || '';
    return (n + a).toUpperCase();
  }

  cerrarSesion(): void {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}