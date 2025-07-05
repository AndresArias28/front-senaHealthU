import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environmets';

@Injectable({
  providedIn: 'root',
})
export class AsignarRutinaService {

  currentAsignacion = new BehaviorSubject<String>(""); // Observable para la asignación actual
  
  constructor(private http: HttpClient) {}

  asignarRutina( datos: any): Observable<any> {
    return this.http.post<any>(environment.urlHost + "asignaciones/asignar", datos).pipe(
      tap((response) => {
        console.log('Asignación de rutina:', response);
        this.currentAsignacion.next(response);
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 200) {
      console.log(error.error); // Retorna la respuesta como exitosa
    }
    if (error.status === 0) {
      console.error('Se ha producio un error ', error.error);
    } else {
      console.error('Backend retornó el código de estado ', error);
    }
    return throwError(
      () => new Error('Algo falló. Por favor intente nuevamente.')
    );
  }


  
}
  