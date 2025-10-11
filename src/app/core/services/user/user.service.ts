import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { User } from '../../../shared/models/user';
import { environment } from '../../../../environments/environment.prod';
import { AprendizDashboardResponse } from '../../../shared/models/aprendiz';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUser(id: number) : Observable<User>{
    return this.http.get<User>(`${environment.urlProd}obtenereUsario/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  updateUser(userRequest : User) : Observable<any>{
    return this.http.put(`${environment.urlProd}actualizarUsuario`, userRequest).pipe(
      catchError(this.handleError)
    )
  }

  geAllUsers() : Observable<User[]> {
    return this.http.get<User[]>(`${environment.urlProd}user/obtenereUsarios`).pipe(
      catchError(this.handleError))
  } 

  registerQr(codigoQR: string): Observable<any> {
    const token = sessionStorage.getItem('token');
 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const body = {
      codigoQR: codigoQR
    };
    
    return this.http.post(`${environment.urlProd}admin/register/qr`, body, { headers }).pipe(
      tap((response) => {
        console.log('QR registrado exitosamente:', response);
      
      }),

      catchError(this.handleError)
    );
  }

  getAprendicesDashboard(): Observable<AprendizDashboardResponse> {
    return this.http.get<AprendizDashboardResponse>(`${environment.urlProd}admin/dashboard/listAprendices`).pipe(
      catchError(this.handleError)
    );
  }




  private handleError(handleError: HttpErrorResponse) {
    if(handleError.status===0){
      console.error('Se ha producido un error ', handleError.message);
    }
    else{
      console.error(`Error del cliente (${handleError.status}):`, handleError.message);
    }
    return throwError(()=> new Error('Algo falló. Por favor intente nuevamente.'));
  }

}
