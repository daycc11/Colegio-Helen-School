import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UsuarioLogueado } from '../auth/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario: UsuarioLogueado | null = null;
  
  // Modelos para identidad
  nombres = '';
  apellidos = '';
  username = '';
  rol = '';
  fotoUrl = ''; // Base64 de la foto
  
  // Modelos para seguridad
  claveActual = '';
  nuevaClave = '';
  repetirClave = '';

  // Estados UI
  guardando = false;
  guardadoExitoso = false;
  mensajeError = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    if (this.usuario) {
      this.nombres = this.usuario.nombres || '';
      this.apellidos = this.usuario.apellidos || '';
      this.username = this.usuario.username || '';
      this.rol = this.usuario.rol || '';
      this.fotoUrl = this.usuario.fotoUrl || 'https://i.pravatar.cc/150?img=11'; // Default si no tiene
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoUrl = e.target.result; // Actualizamos el preview en UI (Base64)
      };
      reader.readAsDataURL(file);
    }
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  async guardarCambios(): Promise<void> {
    if (!this.usuario) return;
    
    this.mensajeError = '';

    // Validar contraseña si intentan cambiarla
    if (this.nuevaClave || this.claveActual || this.repetirClave) {
      if (!this.claveActual) {
        this.mensajeError = 'Para cambiar la contraseña, debe ingresar la contraseña actual.';
        return;
      }
      if (this.nuevaClave !== this.repetirClave) {
        this.mensajeError = 'La nueva contraseña no coincide con la confirmación.';
        return;
      }
      if (this.nuevaClave.length < 8) {
        this.mensajeError = 'La nueva contraseña debe tener al menos 8 caracteres.';
        return;
      }
    }

    this.guardando = true;
    
    try {
      // 1. Guardar foto (si cambió)
      if (this.fotoUrl && this.fotoUrl !== this.usuario.fotoUrl && this.fotoUrl !== 'https://i.pravatar.cc/150?img=11') {
        await this.authService.actualizarFoto(this.usuario.id, this.fotoUrl).toPromise();
      }

      // 2. Guardar perfil básico
      const datosPerfil = {
        nombres: this.nombres,
        apellidos: this.apellidos,
        username: this.username
      };
      await this.authService.actualizarPerfil(this.usuario.id, datosPerfil).toPromise();

      // 3. Guardar clave (si proporcionaron una válida)
      if (this.nuevaClave && this.claveActual) {
        await this.authService.cambiarClave(this.usuario.id, this.claveActual, this.nuevaClave).toPromise();
      }

      // Éxito
      this.guardadoExitoso = true;
      this.claveActual = '';
      this.nuevaClave = '';
      this.repetirClave = '';

      setTimeout(() => {
        this.guardadoExitoso = false;
        this.guardando = false;
      }, 2000);

    } catch (error: any) {
      this.guardando = false;
      console.error(error);
      this.mensajeError = error.error?.mensaje || 'Ocurrió un error al guardar los cambios.';
    }
  }
}
