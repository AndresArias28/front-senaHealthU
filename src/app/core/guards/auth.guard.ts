import { CanMatchFn, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { inject } from '@angular/core';

export const authGuard: CanMatchFn = (route, segments) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  if (loginService.userToken) {
    return true;
  }
  router.navigate(['/iniciar-sesion']);
  return false;
};
