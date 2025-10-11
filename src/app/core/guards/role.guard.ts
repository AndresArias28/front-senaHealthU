import { CanMatchFn, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { inject } from '@angular/core';

//el guardian de atención se encarga de verificar si el usuario tiene el rol requerido
export const roleGuard: CanMatchFn = (route, segments) => {
    const loginService = inject(LoginService);
    const router = inject(Router);
    
    const rolUsuario = loginService.getRole(); 
    const rolRequerido = route.data?.['role']; // obtener el rol requerido desde la configuración de la ruta
    if (rolUsuario === rolRequerido) {
    return true;
  }

  console.warn(`Acceso denegado. Rol requerido: ${rolRequerido}, Rol usuario: ${rolUsuario}`);
  router.navigateByUrl('/iniciar-sesion');
  return false;
    // Si el rol coincide, permite el acceso; de lo contrario, deniega el acceso
};
