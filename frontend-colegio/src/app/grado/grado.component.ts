import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Datos } from './datos';
import { DatosServicegrado } from '../datos.service';

@Component({
  selector: 'app-grado',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './grado.component.html',
  styleUrls: ['./grado.component.css']
})
export class GradoComponent implements OnInit {

  grados: Datos[] = [];

  profesores: string[] = [
    'Prof. Juan Pérez',
    'Prof. Rosa Salazar',
    'Prof. Miguel Torres',
    'Prof. Ana Fernández',
    'Prof. Carlos Mendoza',
    'Prof. Lucía Ramírez'
  ];

  modoEdicion = false;
  mostrarModal = false;
  mostrarModalEliminar = false;
  mensaje = '';

  grado: Datos = this.nuevoGrado();

  gradoEliminarId: number | null = null;
  gradoEliminarNombre = '';

  constructor(private datosService: DatosServicegrado) {}

  ngOnInit(): void {
    this.listarGrados();
  }

  nuevoGrado(): Datos {
    return {
      id: undefined,
      nombre: '',
      seccion: '',
      profesorEncargado: ''
    };
  }

  listarGrados(): void {
  this.datosService.getDatos().subscribe({
    next: (grados) => {
      this.grados = grados;
    },
    error: (error) => {
      console.error(error);
      this.mensaje = 'Error al listar grados';
    }
  });
}

  abrirModalRegistro(): void {
    this.modoEdicion = false;
    this.grado = this.nuevoGrado();
    this.mensaje = '';
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.modoEdicion = false;
    this.grado = this.nuevoGrado();
  }

  guardarGrado(): void {
    if (!this.grado.nombre || !this.grado.seccion || !this.grado.profesorEncargado) {
      this.mensaje = 'Complete todos los campos';
      return;
    }

    if (this.modoEdicion && this.grado.id) {
      this.datosService.actualizarGrado(this.grado.id, this.grado).subscribe({
        next: () => {
          this.mensaje = 'Grado actualizado correctamente';
          this.cerrarModal();
          this.listarGrados();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al actualizar grado';
        }
      });
    } else {
      this.datosService.crearGrado(this.grado).subscribe({
        next: () => {
          this.mensaje = 'Grado registrado correctamente';
          this.cerrarModal();
          this.listarGrados();
        },
        error: (error) => {
          console.error(error);
          this.mensaje = 'Error al registrar grado';
        }
      });
    }
  }

  editarGrado(grado: Datos): void {
    this.modoEdicion = true;
    this.mostrarModal = true;
    this.mensaje = '';

    this.grado = {
      id: grado.id,
      nombre: grado.nombre,
      seccion: grado.seccion,
      profesorEncargado: grado.profesorEncargado || ''
    };
  }

  abrirModalEliminar(grado: Datos): void {
    this.gradoEliminarId = grado.id ?? null;
    this.gradoEliminarNombre = `${grado.nombre} ${grado.seccion}`;
    this.mostrarModalEliminar = true;
  }

  cerrarModalEliminar(): void {
    this.mostrarModalEliminar = false;
    this.gradoEliminarId = null;
    this.gradoEliminarNombre = '';
  }

  confirmarEliminar(): void {
    if (!this.gradoEliminarId) {
      return;
    }

    this.datosService.eliminarGrado(this.gradoEliminarId).subscribe({
      next: () => {
        this.mensaje = 'Grado eliminado correctamente';
        this.cerrarModalEliminar();
        this.listarGrados();
      },
      error: (error) => {
        console.error(error);

        if (error.status === 409 && error.error?.mensaje) {
          this.mensaje = error.error.mensaje;
        } else {
          this.mensaje = 'No se puede eliminar este grado porque tiene alumnos asignados.';
        }

        this.cerrarModalEliminar();
      }
    });
  }
}