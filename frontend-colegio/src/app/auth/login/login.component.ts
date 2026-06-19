import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  username = '';
  password = '';
  mostrarClave = false;
  cargando = false;
  errorMsg = '';
  successMsg = '';

  constructor(private authService: AuthService, private router: Router) {
    // Si ya está logueado, redirigir al dashboard
    if (this.authService.estaLogueado()) {
      this.router.navigate(['/dashboard']);
    }

    // Leer query params para mostrar mensaje de logout
    const params = new URLSearchParams(window.location.search);
    if (params.get('logout') !== null) {
      this.successMsg = '✅ Sesión cerrada correctamente.';
    }
  }

  togglePassword(): void {
    this.mostrarClave = !this.mostrarClave;
  }

  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMsg = '⚠️ Por favor complete todos los campos.';
      return;
    }

    this.cargando = true;
    this.errorMsg = '';
    this.successMsg = '';

    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.cargando = false;
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMsg = '⚠️ ' + res.mensaje;
        }
      },
      error: (err) => {
        this.cargando = false;
        if (err.status === 401) {
          this.errorMsg = '⚠️ Usuario o clave inválidos.';
        } else {
          this.errorMsg = '⚠️ Error al conectar con el servidor. Verifique que el backend esté activo.';
        }
      }
    });
  }
}
