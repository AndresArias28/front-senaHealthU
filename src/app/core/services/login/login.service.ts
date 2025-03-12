import { Injectable } from '@angular/core';
import { LoginRequest } from '../../../shared/models/loginRequest';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environmets';
import {jwtDecode} from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  currentUserLoginOn = new BehaviorSubject<boolean>(false);//observable para el estado del login
  currentUserData = new BehaviorSubject<String>("");

  private dataUrl = 'assets/data.json';

  //servicio para el login utilizando httpclient, se inyecta en el constructor 
  // agregar el proveedor en app.config.ts
  constructor(private http: HttpClient) {
    const token = sessionStorage.getItem('token');
    console.log('Token cargado al iniciar el LoginService:', token);
    this.currentUserLoginOn = new BehaviorSubject<boolean>(token !== null);
    this.currentUserData = new BehaviorSubject<String>(token || "");
 
  }

  getRole() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.rol;
    }
  }

  recoverPassword(emailUsuario: string): Observable<any> {
    return this.http.post<any>(environment.urlHost+"auth/forgot-password", {emailUsuario}).pipe(
      tap( (response) => {
        console.log('datos recividos del back:', response);
      }),
      catchError(this.handleError)
    );
  }

  login(credentials: LoginRequest): Observable<any> {
    return this.http.post<any>(environment.urlHost+"auth/login",credentials).pipe(
      tap( (userData) => {//si todo sale bien encadeno una serie de operaciones con tap
        console.log('Token recibido del backend:', userData.token);
        sessionStorage.setItem("token", userData.token);//guarda el token en el sessionStorage
        this.currentUserData.next(userData.token);// emite el token al observable
        this.currentUserLoginOn.next(true);
      }),
      map((userData)=> userData),//transforma el objeto y devuelve el token
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

  //observable que emite el estado actual del usuario
  get userData(): Observable<String | null> {
    return this.currentUserData.asObservable();
  }

  //observable que emite el estado actual del login
  get userLoginOn(): Observable<boolean> {
    return this.currentUserLoginOn.asObservable();
  }

  get userToken(): String | null {
    return this.currentUserData.value;
  }

  logout() {
    sessionStorage.removeItem('token');
    this.currentUserData.next("");
    this.currentUserLoginOn.next(false);
  }
}
