import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class RutineService {

  currentRutine = new BehaviorSubject<String>(""); 
  rutines = new BehaviorSubject<any[]>([]); 
  ejercicios = new BehaviorSubject<any[]>([]); 


  constructor(private http: HttpClient) {}

  registerRutine(formaData: FormData): Observable<any> {
    return this.http.post<any>(environment.urlProd + "rutina/crear", formaData).pipe(
      tap((response) => {
        this.currentRutine.next(response); 
      }),
      catchError(this.handleError)
    );
  }

  updateRutine(formaData: FormData, id: number): Observable<any> {
    return this.http.put<any>(environment.urlProd + "rutina/actualizar/" + id, formaData).pipe(
      tap((response) => {
        this.currentRutine.next(response);
      }),
      catchError(this.handleError)
    );
  }

  getAllRutines(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlProd + "rutina/obtenerRutinas").pipe(
      tap((response) => {
        this.rutines.next(response);
      }),
      catchError(this.handleError)
    );
  }

  getRutineById(id: number): Observable<any> {
    return this.http.get<any>(environment.urlProd + "rutina/obtenerRutina/" + id).pipe(
      tap((response) => {
        this.currentRutine.next(response);
      }),
      catchError(this.handleError)
    );
  }

  getAllAsinacionRutines(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlProd + "asignaciones/obttenerAll").pipe(
      tap((response) => {
        this.rutines.next(response); // Actualiza el observable de rutinas con las asignaciones
      }),
      catchError(this.handleError)
    );
  }
  
  getAllExcercises(): Observable<any[]> {
    return this.http.get<any[]>(environment.urlProd + "ejercicio/obtenerEjercicios").pipe(
      tap((response) => {
        this.ejercicios.next(response); // Actualiza el observable de rutinas con los ejercicios
      }),
      catchError(this.handleError)
    );
  }
      
  deleteRutine(id: number): Observable<any> {
    return this.http.delete<any>(environment.urlProd + "rutina/eliminarRutinas/" + id).pipe(
      tap((response) => {
        this.currentRutine.next(''); 
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
