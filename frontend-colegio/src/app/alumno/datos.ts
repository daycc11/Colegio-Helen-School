export interface Datos {
  id?: number;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  dni: string;
  grado?: {
    id: number;
    nombre?: string;
    seccion?: string;
  };
  tutor?: {
    id: number;
    nombres?: string;
    apellidos?: string;
  };
}