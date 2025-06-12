import { CanMatchFn } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { inject } from '@angular/core';

//el guardian de atención se encarga de verificar si el usuario tiene el rol requerido
export const roleGuard: CanMatchFn = (route, segments) => {

    const loginService = inject(LoginService);
    //console.log('AuthGuard', loginService.userToken);
    const rolUsuario = loginService.getRole();//obtener rol del usuario del sessionstoage
    console.log('Rol obtenido:', rolUsuario);
    const rolRequerido = route.data?.['role']; //obtener el rol requerido
  
    return rolUsuario === rolRequerido; //compara el rol del usuario con el rol requerido
    // Si el rol coincide, permite el acceso; de lo contrario, deniega el acceso
};
