import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Asignacion, AsignacionRutinaDTO, Rutina } from '../../../shared/models/asignacion';
import { environment } from '../../../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class RutinaAsignacionService {

  constructor(private http: HttpClient) { }

  getRutinas(): Observable<Rutina[]> {
    return this.http.get<Rutina[]>(`${environment.urlProd}rutina`);
  }

  getAsignacionesPorPersona(idPersona: number): Observable<Asignacion[]> {
    return this.http.get<Asignacion[]>(`${environment.urlProd}asignaciones/rutina/${idPersona}`);
  }

  crearAsignacion(dto: AsignacionRutinaDTO): Observable<Asignacion> {
    return this.http.post<Asignacion>(`${environment.urlProd}asignaciones/asignar`, dto);
  }

  actualizarAsignacion(idAsignacion: number, dto: AsignacionRutinaDTO): Observable<Asignacion> {
    return this.http.put<Asignacion>(`${environment.urlProd}asignaciones/actualizar/${idAsignacion}`, dto);
  }

  eliminarAsignacion(idAsignacion: number): Observable<void> {
    return this.http.delete<void>(`${environment.urlProd}asignacion/${idAsignacion}`);
  }
}
