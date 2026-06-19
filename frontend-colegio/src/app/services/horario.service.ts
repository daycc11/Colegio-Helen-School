import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Horario {
  id?: number;
  aula: {
    id: number;
    gradoNivelSeccion: {
      nivel: { id: number; nombre: string };
      grado: { id: number; nombre: string };
      seccion: { id: number; nombre: string };
    };
  };
  cursoDocente: {
    id: number;
    curso: { id: number; nombre: string };
    docente: { id: number; nombres: string; apellidos: string };
  };
  diaSemana: {
    id: number;
    nombre: string;
  };
  horaInicio: string;
  horaFin: string;
}

@Injectable({
  providedIn: 'root'
})
export class HorarioService {
  private apiUrl = 'https://colegio-helen-school-production.up.railway.app/api/horario';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Horario[]> {
    return this.http.get<Horario[]>(this.apiUrl);
  }

  listarPorDocente(idDocente: number): Observable<Horario[]> {
    return this.http.get<Horario[]>(`${this.apiUrl}/docente/${idDocente}`);
  }

  listarPorAula(idNivel: number, idGrado: number, idSeccion: number): Observable<Horario[]> {
    let params = new HttpParams()
      .set('idNivel', idNivel.toString())
      .set('idGrado', idGrado.toString())
      .set('idSeccion', idSeccion.toString());
    return this.http.get<Horario[]>(`${this.apiUrl}/aula`, { params });
  }

  guardar(horario: any): Observable<Horario> {
    return this.http.post<Horario>(this.apiUrl, horario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
