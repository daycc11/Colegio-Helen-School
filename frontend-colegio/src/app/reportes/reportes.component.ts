import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatosServiceMatricula, DatosService, DatosServiceDocente, DatosServicetutor } from '../datos.service';

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  fechaActual = '';
  generando: string | null = null;

  constructor(
    private matriculaService: DatosServiceMatricula,
    private alumnoService: DatosService,
    private docenteService: DatosServiceDocente,
    private tutorService: DatosServicetutor
  ) {}

  ngOnInit(): void {
    this.actualizar();
  }

  actualizar() {
    this.fechaActual = new Date().toLocaleString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  descargarExcel(tipo: 'matriculas' | 'alumnos' | 'docentes' | 'tutores'): void {
    this.generando = tipo;
    this.obtenerDatos(tipo).then(datos => {
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datos);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
      
      const fileName = `Reporte_${tipo}_${new Date().toISOString().slice(0, 10)}.xlsx`;
      XLSX.writeFile(wb, fileName);
      this.generando = null;
    }).catch(err => {
      console.error(err);
      this.generando = null;
    });
  }

  descargarPDF(tipo: 'matriculas' | 'alumnos' | 'docentes' | 'tutores'): void {
    this.generando = tipo;
    this.obtenerDatos(tipo).then(datos => {
      if (datos.length === 0) {
        alert('No hay datos para generar el reporte.');
        this.generando = null;
        return;
      }

      const doc = new jsPDF('landscape');
      
      doc.setFontSize(18);
      doc.text(`Reporte de ${tipo.toUpperCase()}`, 14, 22);
      
      doc.setFontSize(11);
      doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 14, 30);

      const columnas = Object.keys(datos[0]);
      const filas = datos.map(obj => Object.values(obj).map(val => val !== null && val !== undefined ? String(val) : ''));

      autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 35,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [99, 102, 241], textColor: [255, 255, 255] }
      });

      const fileName = `Reporte_${tipo}_${new Date().toISOString().slice(0, 10)}.pdf`;
      doc.save(fileName);
      this.generando = null;
    }).catch(err => {
      console.error(err);
      this.generando = null;
    });
  }

  private obtenerDatos(tipo: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (tipo === 'matriculas') {
        this.matriculaService.getMatriculas().subscribe({
          next: data => {
            const formateado = data.map((m: any) => ({
              ID: m.id,
              'DNI Alumno': m.alumno?.dni || '',
              'Nombre Alumno': `${m.alumno?.nombres || ''} ${m.alumno?.apellidos || ''}`,
              'Nivel': m.aula?.gradoNivelSeccion?.grado?.nivel?.nombre || '',
              'Grado': m.aula?.gradoNivelSeccion?.grado?.nombre || '',
              'Sección': m.aula?.gradoNivelSeccion?.seccion?.nombre || '',
              'Estado': m.estado?.nombre || '',
              'Pago Monto': m.pago?.monto || '',
              'Fecha Pago': m.pago?.fechaPago || ''
            }));
            resolve(formateado);
          },
          error: err => reject(err)
        });
      } else if (tipo === 'alumnos') {
        this.alumnoService.getDatos().subscribe({
          next: data => {
            const formateado = data.map((a: any) => ({
              ID: a.id,
              Nombres: a.nombres,
              Apellidos: a.apellidos,
              DNI: a.dni,
              'Fecha Nacimiento': a.fechaNacimiento,
              'Tutor Nombre': a.tutor ? `${a.tutor.nombres} ${a.tutor.apellidos}` : '',
              'Tutor Teléfono': a.tutor?.telefono || ''
            }));
            resolve(formateado);
          },
          error: err => reject(err)
        });
      } else if (tipo === 'docentes') {
        this.docenteService.getDatos().subscribe({
          next: data => {
            const formateado = data.map((d: any) => ({
              ID: d.id,
              Nombres: d.nombres,
              Apellidos: d.apellidos,
              DNI: d.dni,
              Email: d.email || '',
              Teléfono: d.telefono || '',
              Dirección: d.direccion || ''
            }));
            resolve(formateado);
          },
          error: err => reject(err)
        });
      } else if (tipo === 'tutores') {
        this.tutorService.getDatos().subscribe({
          next: data => {
            const formateado = data.map((t: any) => ({
              ID: t.id,
              Nombres: t.nombres,
              Apellidos: t.apellidos,
              DNI: t.dni,
              Parentesco: t.parentesco || '',
              Email: t.email || '',
              Teléfono: t.telefono || '',
              Dirección: t.direccion || ''
            }));
            resolve(formateado);
          },
          error: err => reject(err)
        });
      }
    });
  }

}
