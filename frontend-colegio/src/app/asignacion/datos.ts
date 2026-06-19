import { Datos as GradoDatos } from '../grado/datos';
import { SeccionDatos } from '../seccion/datos';
import { Datos as DocenteDatos } from '../docente/datos';

export interface AsignacionAcademicaDatos {
  id?: number;
  grado: GradoDatos;
  nivel?: any;
  seccion: SeccionDatos;
  docente: DocenteDatos;
}
