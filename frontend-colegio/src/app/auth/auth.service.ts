import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';

export interface UsuarioLogueado {
  id: number;
  nombres: string;
  apellidos: string;
  username: string;
  rol: string;
}

export interface AuthResponse {
  success: boolean;
  mensaje: string;
  usuario?: UsuarioLogueado;
}

export interface StatusResponse {
  autenticado: boolean;
  usuario?: UsuarioLogueado;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  private httpOptions = { withCredentials: true };

  // Estado de autenticación reactivo
  private usuarioSubject = new BehaviorSubject<UsuarioLogueado | null>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {
    // Al iniciar, restaurar usuario del localStorage si existe
    const saved = localStorage.getItem('helenSchoolUser');
    if (saved) {
      this.usuarioSubject.next(JSON.parse(saved));
    }
  }

  /** Inicia sesión en el backend Spring Security */
  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      { username, password },
      this.httpOptions
    ).pipe(
      tap(res => {
        if (res.success && res.usuario) {
          this.usuarioSubject.next(res.usuario);
          localStorage.setItem('helenSchoolUser', JSON.stringify(res.usuario));
        }
      })
    );
  }

  /** Cierra la sesión en el backend y limpia el estado local */
  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, this.httpOptions).pipe(
      tap(() => {
        this.usuarioSubject.next(null);
        localStorage.removeItem('helenSchoolUser');
      }),
      catchError(() => {
        // Aunque falle el backend, limpiar estado local
        this.usuarioSubject.next(null);
        localStorage.removeItem('helenSchoolUser');
        return of({ success: true });
      })
    );
  }

  /** Verifica si hay una sesión activa en el backend */
  checkStatus(): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.apiUrl}/status`, this.httpOptions).pipe(
      tap(res => {
        if (res.autenticado && res.usuario) {
          this.usuarioSubject.next(res.usuario);
          localStorage.setItem('helenSchoolUser', JSON.stringify(res.usuario));
        } else {
          this.usuarioSubject.next(null);
          localStorage.removeItem('helenSchoolUser');
        }
      }),
      catchError(() => {
        return of({ autenticado: false });
      })
    );
  }

  /** Retorna true si hay un usuario logueado en memoria */
  estaLogueado(): boolean {
    return this.usuarioSubject.value !== null;
  }

  /** Retorna el usuario actual */
  getUsuario(): UsuarioLogueado | null {
    return this.usuarioSubject.value;
  }
}
