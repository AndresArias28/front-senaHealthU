import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from '../services/login/login.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Interceptor ejecutado para la solicitud:', req.url);
  const loginService = inject(LoginService);
  const token: String | null = loginService.userToken;//acceder al token del usuario
  console.log("Token obtenido desde ek interceptor:", token);
  console.log("Solicitud interceptada:", req);

  // Si hay token, clona la solicitud y agrega el encabezado Authorization
  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authReq)
};