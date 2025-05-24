import { Injectable } from '@angular/core';
import { LoginRequest } from '../../../shared/models/loginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environmets';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class RutineService {

  currentRutine = new BehaviorSubject<String>(""); // Observable para la rutina actual


  constructor(private http: HttpClient) {
    
  }

  // Método para registrar una rutina
  registerRutine(rutineData: any): Observable<any> {
    return this.http.post<any>(environment.urlHost + "rutina/crear", rutineData).pipe(
      tap((response) => {
        console.log('Rutina registrada:', response);
        this.currentRutine.next(response);
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
