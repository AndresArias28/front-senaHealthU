import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { User } from '../../../shared/models/user';
import { environment } from '../../../../environments/environmets';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(id: number) : Observable<User>{
    console.log('Ejecutando getUser() para ID:', id);
    return this.http.get<User>(`${environment.urlApi}obtenereUsario/${id}`).pipe(
      catchError(this.handleError)
    ) 
  }

  updateUser(userRequest : User) : Observable<any>{
    return this.http.put(`${environment.urlApi}actualizarUsuario`, userRequest).pipe(
      catchError(this.handleError)
    )
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
