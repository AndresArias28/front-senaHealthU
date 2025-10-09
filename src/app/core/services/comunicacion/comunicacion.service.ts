import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {

  private seccionSubject = new Subject<string>();

  seccion$ = this.seccionSubject.asObservable();

  activarSeccion(nombre: string) {
    this.seccionSubject.next(nombre);
  }
}
