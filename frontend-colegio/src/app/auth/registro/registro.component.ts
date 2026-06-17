import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Rol {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  private apiUrl = 'http://localhost:8080/api/usuario';
  private httpOptions = { withCredentials: true };

  roles: Rol[] = [];
  cargando = false;
  exitoso = false;
  errorMsg = '';
  erroresCampos: { [key: string]: string } = {};

  form = {
    nombres: '',
    apellidos: '',
    username: '',
    clave: '',
    idRol: null as number | null
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.http.get<Rol[]>(`${this.apiUrl}/roles`, this.httpOptions).subscribe({
      next: (data) => this.roles = data,
      error: () => this.errorMsg = 'No se pudieron cargar los roles. Verifique la conexión.'
    });
  }

  onRegistrar(): void {
    this.erroresCampos = {};
    this.errorMsg = '';

    // Validar campos
    if (!this.form.nombres.trim()) {
      this.erroresCampos['nombres'] = 'Los nombres son obligatorios';
    }
    if (!this.form.apellidos.trim()) {
      this.erroresCampos['apellidos'] = 'Los apellidos son obligatorios';
    }
    if (!this.form.username.trim()) {
      this.erroresCampos['username'] = 'El usuario es obligatorio';
    }
    if (!this.form.clave.trim()) {
      this.erroresCampos['clave'] = 'La clave es obligatoria';
    }
    if (!this.form.idRol) {
      this.erroresCampos['rol'] = 'Debe seleccionar un rol';
    }

    if (Object.keys(this.erroresCampos).length > 0) return;

    this.cargando = true;

    const payload = {
      nombres: this.form.nombres.trim(),
      apellidos: this.form.apellidos.trim(),
      username: this.form.username.trim(),
      clave: this.form.clave,
      rol: { id: this.form.idRol }
    };

    this.http.post<any>(`${this.apiUrl}/registrar`, payload, this.httpOptions).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.success) {
          this.exitoso = true;
          this.form = { nombres: '', apellidos: '', username: '', clave: '', idRol: null };
          setTimeout(() => this.router.navigate(['/login']), 2500);
        }
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 409 || err.status === 400) {
          const body = err.error;
          if (body?.campo) {
            this.erroresCampos[body.campo] = body.mensaje;
          } else {
            this.errorMsg = body?.mensaje || 'Error al registrar usuario.';
          }
        } else {
          this.errorMsg = 'Error al conectar con el servidor.';
        }
      }
    });
  }

  irAlLogin(): void {
    this.router.navigate(['/login']);
  }
}
