import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api/reportes';
  fechaActual = '';
  descargando: string | null = null;

  pasos = [
    { num: '1', titulo: 'Seleccionar Reporte', desc: 'Elige el tipo de reporte según tus necesidades.' },
    { num: '2', titulo: 'Descargar', desc: 'Haz clic en "Descargar Excel" para generar el archivo.' },
    { num: '3', titulo: 'Abrir Archivo', desc: 'El archivo se descargará automáticamente en tu equipo.' },
    { num: '4', titulo: 'Datos Actualizados', desc: 'Los reportes contienen la información más reciente del sistema.' }
  ];

  ngOnInit(): void {
    this.fechaActual = new Date().toLocaleString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  descargar(tipo: 'alumnos' | 'tutores' | 'grados' | 'completo'): void {
    this.descargando = tipo;

    // Abrir en nueva pestaña — el backend responde con Content-Disposition: attachment
    const url = `${this.apiUrl}/${tipo}/excel`;

    // Usar fetch + blob para descargar con credenciales de sesión
    fetch(url, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('Error al generar el reporte');
        return res.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${tipo}_${new Date().toISOString().slice(0, 10)}.xlsx`;
        link.click();
        URL.revokeObjectURL(link.href);
        this.descargando = null;
      })
      .catch(err => {
        console.error(err);
        alert('Error al descargar el reporte. Verifique que el backend esté activo.');
        this.descargando = null;
      });
  }
}
