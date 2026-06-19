import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Turno {
  id: number;
  nombre: string;
}

export interface AnioEscolar {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface Aula {
  id?: number;
  grado: { id: number; nombre: string };
  seccion: { id: number; nombre: string };
  turno: Turno;
  anioEscolar: AnioEscolar;
  docente: { id: number; nombres: string; apellidos: string };
  capacidad: number;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AulaService {

  // Asumiendo que esta es la URL actual, de lo contrario ajustarla
  private apiUrl = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(`${this.apiUrl}/turnos`);
  }

  getAniosEscolares(): Observable<AnioEscolar[]> {
    return this.http.get<AnioEscolar[]>(`${this.apiUrl}/anios-escolares`);
  }

  getAulas(idAnioEscolar: number, idGrado?: number): Observable<Aula[]> {
    let url = `${this.apiUrl}/aulas?idAnioEscolar=${idAnioEscolar}`;
    if (idGrado) {
      url += `&idGrado=${idGrado}`;
    }
    return this.http.get<Aula[]>(url);
  }

  getTodasAulas(): Observable<Aula[]> {
    return this.http.get<Aula[]>(`${this.apiUrl}/aulas/todas`);
  }

  guardarAula(aula: any): Observable<Aula> {
    return this.http.post<Aula>(`${this.apiUrl}/aulas`, aula);
  }

  eliminarAula(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/aulas/${id}`);
  }
}
