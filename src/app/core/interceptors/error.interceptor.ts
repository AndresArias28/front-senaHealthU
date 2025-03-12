import { HttpInterceptorFn } from '@angular/common/http';
import { toast } from 'ngx-sonner';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
      catchError((error) => {
        console.log(error);
        if (error.status === 400) {
          toast.error('bad request');
        } else if (error.status === 500) {
          toast.error('internal server error ', error.error);
        }
        return throwError(() => error);
      })
    );
};
