export interface Datos {
  id?: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  dni: string;
  nivel?: any;
  grado?: {
    id: number;
    nombre?: string;
  };
  seccion?: {
    id: number;
    nombre?: string;
  };
  tutor?: {
    id: number;
    nombres?: string;
    apellidos?: string;
  };
}