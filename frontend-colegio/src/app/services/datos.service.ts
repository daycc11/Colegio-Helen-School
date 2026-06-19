import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private apiUrl = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  getCursos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/curso`);
  }

  getDocentes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/docente`);
  }

  getNiveles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/nivel`);
  }
}
