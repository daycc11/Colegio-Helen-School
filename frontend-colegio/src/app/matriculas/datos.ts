export interface GradoInfo {
  id: number;
  nombre?: string;
  seccion?: string;
}

export interface TutorInfo {
  id: number;
  nombres?: string;
  apellidos?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  parentesco?: string;
}

export interface Datos {
  id?: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  dni: string;
  grado?: GradoInfo;
  tutor?: TutorInfo;
  // Campos de matrícula
  fechaMatricula?: string;
  fechaFinMatricula?: string;
  metodoPago?: string;
  montoPagado?: number;
}