import { CanMatchFn } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { inject } from '@angular/core';

//el guardian de atención se encarga de verificar si el usuario está autenticado
export const authGuard: CanMatchFn = (route, segments) => {
  const loginService = inject(LoginService);
  if (loginService.userToken) {
    console.log('usuario autenticado ');
    return true;
  }
  return false;



};
