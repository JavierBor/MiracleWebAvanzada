import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userStr = localStorage.getItem('miracle_user');

  if (userStr) {
    try {
      const usuario = JSON.parse(userStr);
      if (usuario.rol === 'ADMIN') {
        return true;
      }
    } catch {
      // JSON inválido
    }
  }

  localStorage.removeItem('miracle_admin_mode');
  return router.createUrlTree(['/dashboard']);
};