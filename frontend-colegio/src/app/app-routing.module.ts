import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AlumnoComponent } from './alumno/alumno.component';
import { TutorComponent } from './tutor/tutor.component';
import { MatriculasComponent } from './matriculas/matriculas.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { ReportesComponent } from './reportes/reportes.component';
import { DocenteComponent } from './docente/docente.component';
import { PagoComponent } from './pago/pago.component';
import { authGuard } from './auth/auth.guard';
import { AulasComponent } from './aulas/aulas.component';
import { CursosComponent } from './cursos/cursos.component';
import { HorariosComponent } from './horarios/horarios.component';
import { PerfilComponent } from './perfil/perfil.component';

export const routes: Routes = [
  // Rutas públicas (sin sidebar, sin autenticación)
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'home', component: HomeComponent },

  // Rutas protegidas (requieren autenticación)
  { path: 'dashboard',  component: DashboardComponent,  canActivate: [authGuard] },
  { path: 'alumno',     component: AlumnoComponent,     canActivate: [authGuard] },
  { path: 'aulas',      component: AulasComponent,      canActivate: [authGuard] },
  { path: 'cursos',     component: CursosComponent,     canActivate: [authGuard] },
  { path: 'tutor',      component: TutorComponent,      canActivate: [authGuard] },
  { path: 'matriculas', component: MatriculasComponent, canActivate: [authGuard] },
  { path: 'reportes',   component: ReportesComponent,   canActivate: [authGuard] },
  { path: 'docente',    component: DocenteComponent,    canActivate: [authGuard] },
  { path: 'pagos',      component: PagoComponent,       canActivate: [authGuard] },
  { path: 'horarios',   component: HorariosComponent,   canActivate: [authGuard] },
  { path: 'perfil',     component: PerfilComponent,     canActivate: [authGuard] },

  { path: '**', redirectTo: 'login' }
];