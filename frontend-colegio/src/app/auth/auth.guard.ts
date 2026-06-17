import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard de rutas — redirige al login si el usuario no está autenticado.
 * Uso en rutas: canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estaLogueado()) {
    return true;
  }

  // No está logueado → redirigir al login
  router.navigate(['/login']);
  return false;
};
