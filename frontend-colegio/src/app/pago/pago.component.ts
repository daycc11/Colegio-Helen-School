import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlumnoInfo, Pago } from './pago.model';

type MetodoPago = 'tarjeta' | 'transferencia' | 'yape' | 'tesoreria';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  private api = 'https://colegio-helen-school-production.up.railway.app/api';

  // Datos
  alumnos: AlumnoInfo[] = [];
  pendientes: AlumnoInfo[] = [];
  historial: Pago[] = [];
  alumnoSeleccionado: AlumnoInfo | null = null;

  // UI
  vista: 'pendientes' | 'procesar' | 'historial' = 'pendientes';
  metodoPago: MetodoPago = 'tarjeta';
  procesando = false;
  exitoso = false;
  errorMsg = '';
  cargandoPendientes = true;
  cargandoHistorial = false;

  // Formulario de pago
  form = {
    idAlumno: null as number | null,
    monto: 350,
    // Tarjeta
    numeroTarjeta: '',
    nombreTitular: '',
    vencimiento: '',
    cvv: '',
    mostrarCvv: false,
    // Transferencia
    banco: '',
    numeroOperacion: '',
    // Yape/Plin
    numeroCelular: '',
    // Tesorería
    observaciones: ''
  };

  metodos: { id: MetodoPago; label: string; icon: string; desc: string; color: string }[] = [
    { id: 'tarjeta',       label: 'Tarjeta de Crédito/Débito', icon: 'credit_card',     desc: 'Visa, Mastercard, American Express.',       color: 'var(--primary)' },
    { id: 'transferencia', label: 'Transferencia Bancaria',     icon: 'account_balance', desc: 'BCP, BBVA, Interbank, Scotiabank.',          color: 'var(--primary)' },
    { id: 'yape',          label: 'Yape / Plin',                icon: 'qr_code_scanner', desc: 'Pago rápido mediante código QR o celular.',  color: '#7c3aed'        },
    { id: 'tesoreria',     label: 'Pago en Tesorería',          icon: 'payments',        desc: 'Efectivo directamente en el colegio.',       color: 'var(--primary)' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarTodos();
  }

  cargarTodos(): void {
    this.http.get<AlumnoInfo[]>(`${this.api}/alumno`).subscribe({
      next: (data) => this.alumnos = data
    });
    this.cargarPendientes();
  }

  cargarPendientes(): void {
    this.cargandoPendientes = true;
    this.http.get<AlumnoInfo[]>(`${this.api}/pagos/pendientes`).subscribe({
      next: (data) => { this.pendientes = data; this.cargandoPendientes = false; },
      error: () => { this.cargandoPendientes = false; }
    });
  }

  iniciarPago(alumno: AlumnoInfo): void {
    this.alumnoSeleccionado = alumno;
    this.form.idAlumno = alumno.id;
    this.exitoso = false;
    this.errorMsg = '';
    this.vista = 'procesar';
  }

  seleccionarMetodo(m: MetodoPago): void {
    this.metodoPago = m;
    this.exitoso = false;
    this.errorMsg = '';
  }

  seleccionarAlumno(): void {
    const a = this.pendientes.find(x => x.id === Number(this.form.idAlumno));
    this.alumnoSeleccionado = a || null;
  }

  formatearTarjeta(event: Event): void {
    const el = event.target as HTMLInputElement;
    let val = el.value.replace(/\D/g, '').substring(0, 16);
    el.value = val.replace(/(.{4})/g, '$1 ').trim();
    this.form.numeroTarjeta = el.value;
  }

  formatearVencimiento(event: Event): void {
    const el = event.target as HTMLInputElement;
    let val = el.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) val = val.substring(0, 2) + '/' + val.substring(2);
    el.value = val;
    this.form.vencimiento = el.value;
  }

  procesarPago(): void {
    if (!this.form.idAlumno) { this.errorMsg = 'Selecciona un alumno.'; return; }
    if (!this.form.monto || this.form.monto <= 0) { this.errorMsg = 'Ingresa un monto válido.'; return; }
    
    if (!this.alumnoSeleccionado || !this.alumnoSeleccionado.idPago || !this.alumnoSeleccionado.idMatricula) {
        this.errorMsg = 'El alumno no tiene una matrícula pendiente válida.';
        return;
    }

    const payload = {
        idPago: this.alumnoSeleccionado.idPago,
        idMatricula: this.alumnoSeleccionado.idMatricula,
        monto: this.form.monto
    };

    this.procesando = true;
    this.errorMsg = '';

    setTimeout(() => {
      this.http.post(`${this.api}/pagos/procesar`, payload).subscribe({
        next: () => {
          this.procesando = false;
          this.exitoso = true;
          this.resetForm();
          this.cargarPendientes(); // actualizar lista pendientes
        },
        error: () => {
          this.procesando = false;
          this.errorMsg = 'Error al procesar el pago. Verifique los datos.';
        }
      });
    }, 1500);
  }

  cargarHistorial(alumnoId?: number): void {
    // Historial no está completamente implementado en el backend todavía para simplificar
    this.cargandoHistorial = true;
    this.historial = [];
    setTimeout(() => this.cargandoHistorial = false, 500);
  }

  verHistorial(): void {
    this.cargarHistorial(this.form.idAlumno ? Number(this.form.idAlumno) : undefined);
    this.vista = 'historial';
  }

  resetForm(): void {
    this.form.numeroTarjeta = '';
    this.form.nombreTitular = '';
    this.form.vencimiento = '';
    this.form.cvv = '';
    this.form.banco = '';
    this.form.numeroOperacion = '';
    this.form.numeroCelular = '';
    this.form.observaciones = '';
  }

  getIconoEstado(estado: string): string {
    return estado === 'COMPLETADO' ? 'check_circle' : 'pending';
  }
  getColorEstado(estado: string): string {
    return estado === 'COMPLETADO' ? '#15803d' : '#d97706';
  }
  getBgEstado(estado: string): string {
    return estado === 'COMPLETADO' ? '#dcfce7' : '#fef3c7';
  }

  getIniciales(nombres: string, apellidos: string): string {
    return ((nombres?.charAt(0) || '') + (apellidos?.charAt(0) || '')).toUpperCase();
  }

  // Paginación Pendientes
  paginaActualPendientes = 1;
  porPaginaPendientes = 20;

  get paginadosPendientes(): AlumnoInfo[] {
    const inicio = (this.paginaActualPendientes - 1) * this.porPaginaPendientes;
    return this.pendientes.slice(inicio, inicio + this.porPaginaPendientes);
  }

  get totalPaginasPendientes(): number {
    return Math.ceil(this.pendientes.length / this.porPaginaPendientes) || 1;
  }

  get paginasPendientes(): number[] {
    return Array.from({ length: this.totalPaginasPendientes }, (_, i) => i + 1);
  }

  get inicioMostradoPendientes(): number {
    if (this.pendientes.length === 0) return 0;
    return (this.paginaActualPendientes - 1) * this.porPaginaPendientes + 1;
  }

  get finMostradoPendientes(): number {
    const fin = this.paginaActualPendientes * this.porPaginaPendientes;
    return fin > this.pendientes.length ? this.pendientes.length : fin;
  }

  // Paginación Historial
  paginaActualHistorial = 1;
  porPaginaHistorial = 20;

  get paginadosHistorial(): Pago[] {
    const inicio = (this.paginaActualHistorial - 1) * this.porPaginaHistorial;
    return this.historial.slice(inicio, inicio + this.porPaginaHistorial);
  }

  get totalPaginasHistorial(): number {
    return Math.ceil(this.historial.length / this.porPaginaHistorial) || 1;
  }

  get paginasHistorial(): number[] {
    return Array.from({ length: this.totalPaginasHistorial }, (_, i) => i + 1);
  }

  get inicioMostradoHistorial(): number {
    if (this.historial.length === 0) return 0;
    return (this.paginaActualHistorial - 1) * this.porPaginaHistorial + 1;
  }

  get finMostradoHistorial(): number {
    const fin = this.paginaActualHistorial * this.porPaginaHistorial;
    return fin > this.historial.length ? this.historial.length : fin;
  }
}
