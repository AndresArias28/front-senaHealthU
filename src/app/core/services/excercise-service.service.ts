import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environmets';

@Injectable({
  providedIn: 'root',
})
export class ExcerciseServiceService {

  ejercicios = new BehaviorSubject<String[]>([]); // Observable para los ejercicios
  ejercicioACtual = new BehaviorSubject<String>(''); // Observable para el ejercicio actual

  constructor(private http: HttpClient) {}

  registerExercise(formData: FormData): Observable<any> {
    return this.http
      .post<any>(environment.urlHost + 'ejercicio/crearEjercicio', formData)
      .pipe(
        tap((response) => {
          console.log('Ejercicio registrado:', response);
          this.ejercicioACtual.next(response); // actualiza el observable con el nuevo ejercicio
        }),
        catchError(this.handleError)
      );
  }

  updateExercise(formData: FormData, id: number): Observable<any> {
    return this.http
      .put<any>(environment.urlHost + 'ejercicio/actualizarEjercicio/' + id, formData)
      .pipe(
        tap((response) => {
          console.log('Ejercicio actualizado:', response);
          this.ejercicioACtual.next(response);
        }),
        catchError(this.handleError)
      );
  }

  deleteExercise(id: number): Observable<any> {
    return this.http
      .delete<any>(environment.urlHost + 'ejercicio/eliminarEjercicio/' + id)
      .pipe(
        tap((response) => {
          console.log('Ejercicio eliminado:', response);
          // Aquí podrías actualizar el observable de ejercicios si es necesario
        }),
        catchError(this.handleError)
      )
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
