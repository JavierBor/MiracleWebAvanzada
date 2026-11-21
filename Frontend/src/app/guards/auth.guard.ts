import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('miracle_token');
  const userStr = localStorage.getItem('miracle_user');

  if (token && userStr) {
    return true;
  }

  return router.createUrlTree(['/login']);
};