export interface AlumnoInfo {
  id: number;
  nombres: string;
  apellidos: string;
  dni: string;
  grado?: { nombre?: string; seccion?: string };
  tutor?: { nombres?: string; apellidos?: string };
  fechaMatricula?: string;
}

export interface Pago {
  id?: number;
  alumno: { id: number; nombres?: string; apellidos?: string };
  metodoPago: string;
  monto: number;
  fechaPago?: string;
  estado?: string;
  ultimosDigitos?: string;
  nombreTitular?: string;
  banco?: string;
  numeroOperacion?: string;
  numeroCelular?: string;
  observaciones?: string;
}
