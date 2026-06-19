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
      <div class="flex h-screen bg-surface font-body text-on-surface overflow-hidden">
        
        <!-- Backdrop for Mobile -->
        <div *ngIf="sidebarOpen" (click)="sidebarOpen = false" class="fixed inset-0 bg-on-surface/20 z-20 lg:hidden backdrop-blur-sm transition-opacity"></div>

        <!-- SideNavBar -->
        <aside class="h-screen w-64 fixed left-0 top-0 bg-surface flex flex-col py-6 gap-2 neo-raised z-30 transition-transform duration-300 ease-in-out lg:translate-x-0" 
               [class.-translate-x-full]="!sidebarOpen" [class.translate-x-0]="sidebarOpen">
          <div class="px-6 mb-8 flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl neo-raised flex items-center justify-center bg-surface">
                <span class="material-symbols-outlined text-primary">school</span>
              </div>
              <div>
                <h1 class="text-headline-sm font-semibold text-primary">Helen School</h1>
                <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Management</p>
              </div>
            </div>
            <button (click)="sidebarOpen = false" class="lg:hidden text-outline hover:text-primary">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <nav class="flex-1 space-y-1 overflow-y-auto">
            <a routerLink="/dashboard" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary">dashboard</span>
              <span class="font-body text-label-sm font-semibold">Dashboard</span>
            </a>
            <a routerLink="/matriculas" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary">edit_note</span>
              <span class="font-body text-label-sm font-semibold">Matrículas</span>
            </a>
            <a routerLink="/alumno" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary">groups</span>
              <span class="font-body text-label-sm font-semibold">Estudiantes</span>
            </a>
            <a routerLink="/tutor" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary">family_restroom</span>
              <span class="font-body text-label-sm font-semibold">Tutores</span>
            </a>
            <a routerLink="/docente" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary">person_celebrate</span>
              <span class="font-body text-label-sm font-semibold">Docentes</span>
            </a>
            <a routerLink="/aulas" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary">domain</span>
              <span class="font-body text-label-sm font-semibold">Aulas</span>
            </a>
            <a routerLink="/cursos" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary">book</span>
              <span class="font-body text-label-sm font-semibold">Cursos</span>
            </a>
            <a routerLink="/horarios" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary" style="font-variation-settings: 'FILL' 1;">calendar_month</span>
              <span class="font-body text-label-sm font-semibold">Horario</span>
            </a>
            <a routerLink="/pagos" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary">payments</span>
              <span class="font-body text-label-sm font-semibold">Pagos</span>
            </a>
            <a routerLink="/reportes" (click)="sidebarOpen = false" routerLinkActive="active-sidebar-link" class="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-on-surface-variant hover:text-primary hover:neo-raised transition-all group">
              <span class="material-symbols-outlined group-hover:text-primary">bar_chart</span>
              <span class="font-body text-label-sm font-semibold">Reportes</span>
            </a>
          </nav>
          
          <div class="mt-auto px-6 pb-6 cursor-pointer">
            <div (click)="cerrarSesion()" class="flex items-center gap-3 text-error hover:text-error/80 transition-colors font-semibold">
              <span class="material-symbols-outlined">logout</span>
              <span class="font-body text-sm">Cerrar Sesión</span>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <div class="flex-1 flex flex-col min-h-screen">
          
          <!-- TopNavBar -->
          <header class="h-20 w-full lg:w-[calc(100%-16rem)] fixed top-0 right-0 z-10 bg-surface flex justify-between items-center px-4 lg:px-8 shadow-[0_4px_16px_rgba(0,0,0,0.05)] transition-all">
            <div class="flex items-center gap-3 lg:gap-6 flex-1">
              <button (click)="sidebarOpen = true" class="lg:hidden w-10 h-10 rounded-xl neo-raised flex items-center justify-center text-primary">
                <span class="material-symbols-outlined">menu</span>
              </button>
              <div class="hidden sm:flex w-full max-w-[200px] lg:max-w-md neo-inset bg-surface rounded-xl items-center px-4 py-2">
                <span class="material-symbols-outlined text-outline mr-2 text-sm">search</span>
                <input class="bg-transparent border-none outline-none focus:ring-0 text-sm w-full placeholder:text-outline-variant font-body" placeholder="Buscar..." type="text">
              </div>
            </div>
            
            <div class="flex items-center gap-3 lg:gap-4">
              <button class="hidden md:flex w-10 h-10 rounded-xl neo-raised items-center justify-center text-on-surface-variant hover:text-primary transition-all">
                <span class="material-symbols-outlined">notifications</span>
              </button>
              <button class="hidden md:flex w-10 h-10 rounded-xl neo-raised items-center justify-center text-on-surface-variant hover:text-primary transition-all">
                <span class="material-symbols-outlined">settings</span>
              </button>
              <div class="hidden md:block h-8 w-[1px] bg-outline-variant mx-1 lg:mx-2"></div>
              
              <!-- User Profile in Header -->
              <div class="flex items-center gap-2 lg:gap-3 cursor-pointer group px-1 lg:px-2" routerLink="/perfil" title="Editar Perfil">
                <div class="text-right hidden sm:block">
                  <p class="text-sm font-extrabold text-primary group-hover:text-primary-fixed-variant transition-colors">{{ usuario?.nombres || 'Admin Carl Sagan' }}</p>
                  <p class="text-[10px] text-primary/70 font-semibold">{{ usuario?.rol || 'Administrador' }}</p>
                </div>
                <div class="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden neo-raised border-2 border-surface flex items-center justify-center bg-primary text-white font-bold text-sm">
                  <img [src]="usuario?.fotoUrl || 'https://i.pravatar.cc/150?img=11'" alt="Profile" class="w-full h-full object-cover">
                </div>
              </div>
            </div>
          </header>

          <!-- Router Outlet Area -->
          <main class="lg:ml-64 mt-20 p-4 lg:p-8 h-[calc(100vh-5rem)] overflow-y-auto w-full lg:w-[calc(100%-16rem)]">
            <router-outlet></router-outlet>
          </main>
          
        </div>
      </div>
    </ng-container>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend-colegio';
  mostrarLayout = false;
  sidebarOpen = false;
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