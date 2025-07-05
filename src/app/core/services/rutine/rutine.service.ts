import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environmets';


@Injectable({
  providedIn: 'root'
})
export class RutineService {

  currentRutine = new BehaviorSubject<String>(""); // Observable para la rutina actual
  rutines = new BehaviorSubject<any[]>([]); // Observable para todas las rutinas
  ejercicios = new BehaviorSubject<any[]>([]); // Observable para los ejercicios


  constructor(private http: HttpClient) {}

  //registrar una rutina
  registerRutine(formaData: FormData): Observable<any> {
    return this.http.post<any>(environment.urlHost + "rutina/crear", formaData).pipe(
      tap((response) => {
        console.log('Rutina registrada:', response);
        this.currentRutine.next(response); // actualiza el observable con la nueva rutina
      }),
      
      catchError(this.handleError)
    );
  }

  //actualizar una rutina
  updateRutine(formaData: FormData, id: number): Observable<any> {
    return this.http.put<any>(environment.urlHost + "rutina/actualizar/" + id, formaData).pipe(
      tap((response) => {
        console.log('Rutina actualizada:', response);
        this.currentRutine.next(response);
      }),
      catchError(this.handleError)
    );
  }

  //obtener todas las rutinas
  getAllRutines(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlHost + "rutina/obtenerRutinas").pipe(
      tap((response) => {
        console.log('Rutinas obtenidas:', response);
        this.rutines.next(response);
      }),
      catchError(this.handleError)
    );
  }

  getRutineById(id: number): Observable<any> {
    return this.http.get<any>(environment.urlHost + "rutina/obtenerRutina/" + id).pipe(
      tap((response) => {
        console.log('Rutina obtenida:', response);
        this.currentRutine.next(response);
      }),
      catchError(this.handleError)
    );
  }

  getAllExcercises(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlHost + "ejercicio/obtenerEjercicios").pipe(
      tap((response) => {
        console.log('Ejercicios obtenidos:', response);
        this.ejercicios.next(response); // Actualiza el observable de rutinas con los ejercicios
      }),
      catchError(this.handleError)
    );
  }
      
  //eliminar una rutina por ID
  deleteRutine(id: number): Observable<any> {
    return this.http.delete<any>(environment.urlHost + "rutina/eliminarRutinas/" + id).pipe(
      tap((response) => {
        console.log('Rutina eliminada:', response);
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
