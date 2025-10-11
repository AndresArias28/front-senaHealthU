import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ExcerciseServiceService {
  ejercicios = new BehaviorSubject<String[]>([]);
  ejercicioACtual = new BehaviorSubject<String>('');

  constructor(private http: HttpClient) {}

  registerExercise(formData: FormData): Observable<any> {
    return this.http
      .post<any>(environment.urlProd + 'ejercicio/crearEjercicio', formData)
      .pipe(
        tap((response) => {
          this.ejercicioACtual.next(response); // actualiza el observable con el nuevo ejercicio
        }),
        catchError(this.handleError)
      );
  }

  updateExercise(formData: FormData, id: number): Observable<any> {
    return this.http
      .put<any>(
        environment.urlProd + 'ejercicio/actualizarEjercicio/' + id,
        formData
      )
      .pipe(
        tap((response) => {
          this.ejercicioACtual.next(response);
        }),
        catchError(this.handleError)
      );
  }

  deleteExercise(id: number): Observable<any> {
    return this.http
      .delete<any>(environment.urlProd + 'ejercicio/eliminarEjercicio/' + id)
      .pipe(
        tap((response) => {
          this.ejercicioACtual.next('');
        }),
        catchError(this.handleError)
      );
  }

  getAllExcercises(): Observable<any[]> {
    return this.http
      .get<any[]>(environment.urlProd + 'ejercicio/obtenerEjercicios')
      .pipe(
        tap((response) => {
          this.ejercicios.next(response); // Actualiza el observable de rutinas con los ejercicios
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 200) {
      console.error('Error inesperado ', error.error);
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
