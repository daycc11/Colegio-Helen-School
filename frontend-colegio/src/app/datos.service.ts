// Importamos estos elementos
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Datos as MatriculaDatos } from './matriculas/datos';

// Importamos las interfaces 'datos'
import { Datos as AlumnoDatos } from './alumno/datos';
import { Datos as GradoDatos } from './grado/datos';
import { Datos as TutorDatos } from './tutor/datos';
import { Datos as DocenteDatos } from './docente/datos';

// Opciones HTTP comunes: envía la cookie de sesión en cada petición
const httpOptions = { withCredentials: true };

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  // URL de la API
  private url = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  // LISTAR ALUMNOS - GET
  getDatos(): Observable<AlumnoDatos[]> {
    return this.http.get<AlumnoDatos[]>(`${this.url}/alumno`, httpOptions);
  }

  // REGISTRAR ALUMNO - POST
  crearAlumno(alumno: AlumnoDatos): Observable<AlumnoDatos> {
    return this.http.post<AlumnoDatos>(`${this.url}/alumno`, alumno, httpOptions);
  }

  // ACTUALIZAR ALUMNO - PUT
  actualizarAlumno(id: number, alumno: AlumnoDatos): Observable<AlumnoDatos> {
    return this.http.put<AlumnoDatos>(`${this.url}/alumno/${id}`, alumno, httpOptions);
  }

  // ELIMINAR ALUMNO - DELETE
  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/alumno/${id}`, httpOptions);
  }

}



@Injectable({
  providedIn: 'root'
})
export class DatosServicegrado {

  private url = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  // LISTAR GRADOS - GET
  getDatos(): Observable<GradoDatos[]> {
    return this.http.get<GradoDatos[]>(`${this.url}/grado`, httpOptions);
  }

  // REGISTRAR GRADO - POST
  crearGrado(grado: GradoDatos): Observable<GradoDatos> {
    return this.http.post<GradoDatos>(`${this.url}/grado`, grado, httpOptions);
  }

  // ACTUALIZAR GRADO - PUT
  actualizarGrado(id: number, grado: GradoDatos): Observable<GradoDatos> {
    return this.http.put<GradoDatos>(`${this.url}/grado/${id}`, grado, httpOptions);
  }

  // ELIMINAR GRADO - DELETE
  eliminarGrado(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/grado/${id}`, httpOptions);
  }

  // NOMBRES DE GRADOS REGISTRADOS (para el combo)
  getNombresGrado(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/grado/nombres`, httpOptions);
  }

}



@Injectable({
  providedIn: 'root'
})
export class DatosServicetutor {

  private url = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  // LISTAR TUTORES - GET
  getDatos(): Observable<TutorDatos[]> {
    return this.http.get<TutorDatos[]>(`${this.url}/tutor`, httpOptions);
  }

  // REGISTRAR TUTOR - POST
  crearTutor(tutor: TutorDatos): Observable<TutorDatos> {
    return this.http.post<TutorDatos>(`${this.url}/tutor`, tutor, httpOptions);
  }

  // ACTUALIZAR TUTOR - PUT
  actualizarTutor(id: number, tutor: TutorDatos): Observable<TutorDatos> {
    return this.http.put<TutorDatos>(`${this.url}/tutor/${id}`, tutor, httpOptions);
  }

  // ELIMINAR TUTOR - DELETE
  eliminarTutor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/tutor/${id}`, httpOptions);
  }

}

@Injectable({
  providedIn: 'root'
})
export class DatosServiceMatricula {

  private url = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  // LISTAR MATRÍCULAS
  getMatriculas(): Observable<MatriculaDatos[]> {
    return this.http.get<MatriculaDatos[]>(`${this.url}/alumno`, httpOptions);
  }

  // REGISTRAR MATRÍCULA
  crearMatricula(matricula: MatriculaDatos): Observable<MatriculaDatos> {
    return this.http.post<MatriculaDatos>(`${this.url}/alumno`, matricula, httpOptions);
  }

  // ACTUALIZAR MATRÍCULA
  actualizarMatricula(id: number, matricula: MatriculaDatos): Observable<MatriculaDatos> {
    return this.http.put<MatriculaDatos>(`${this.url}/alumno/${id}`, matricula, httpOptions);
  }
}


@Injectable({
  providedIn: 'root'
})
export class DatosServiceDocente {

  private url = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  // LISTAR DOCENTES - GET
  getDatos(): Observable<DocenteDatos[]> {
    return this.http.get<DocenteDatos[]>(`${this.url}/docente`, httpOptions);
  }

  // REGISTRAR DOCENTE - POST
  crearDocente(docente: DocenteDatos): Observable<any> {
    return this.http.post<any>(`${this.url}/docente`, docente, httpOptions);
  }

  // ACTUALIZAR DOCENTE - PUT
  actualizarDocente(id: number, docente: DocenteDatos): Observable<any> {
    return this.http.put<any>(`${this.url}/docente/${id}`, docente, httpOptions);
  }

  // ELIMINAR DOCENTE - DELETE
  eliminarDocente(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/docente/${id}`, httpOptions);
  }
}

import { SeccionDatos } from './seccion/datos';

@Injectable({
  providedIn: 'root'
})
export class DatosServiceSeccion {
  private url = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  getDatos(): Observable<SeccionDatos[]> {
    return this.http.get<SeccionDatos[]>(`${this.url}/seccion`, httpOptions);
  }
  crearSeccion(seccion: SeccionDatos): Observable<any> {
    return this.http.post<any>(`${this.url}/seccion`, seccion, httpOptions);
  }
  actualizarSeccion(id: number, seccion: SeccionDatos): Observable<any> {
    return this.http.put<any>(`${this.url}/seccion/${id}`, seccion, httpOptions);
  }
  eliminarSeccion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/seccion/${id}`, httpOptions);
  }
}

import { AsignacionAcademicaDatos } from './asignacion/datos';

@Injectable({
  providedIn: 'root'
})
export class DatosServiceAsignacion {
  private url = 'https://colegio-helen-school-production.up.railway.app/api';

  constructor(private http: HttpClient) { }

  getDatos(): Observable<AsignacionAcademicaDatos[]> {
    return this.http.get<AsignacionAcademicaDatos[]>(`${this.url}/asignacion`, httpOptions);
  }
  crearAsignacion(asignacion: AsignacionAcademicaDatos): Observable<any> {
    return this.http.post<any>(`${this.url}/asignacion`, asignacion, httpOptions);
  }
  actualizarAsignacion(id: number, asignacion: AsignacionAcademicaDatos): Observable<any> {
    return this.http.put<any>(`${this.url}/asignacion/${id}`, asignacion, httpOptions);
  }
  eliminarAsignacion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/asignacion/${id}`, httpOptions);
  }
}