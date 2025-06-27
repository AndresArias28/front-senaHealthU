import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComunicacionService } from '../../core/services/comunicacion/comunicacion.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {

  @Input() seccionActual!: string  //Definite Assignment Assertion - recibe cambios del padre
  @Input() tipoUsuario!: string; 
  @Output() seccionSeleccionada = new EventEmitter<string>(); // Emite cambios aL padre

  constructor(private comunicacionsv: ComunicacionService) {}

  ngOnInit() {
    // Suscribirse al observable del servicio de comunicación
    this.comunicacionsv.seccion$.subscribe((seccion: string) => {
      this.cambiarSeccion(seccion);
    });
  }


  cambiarSeccion(seccion: string) {
    if (seccion === "logout") {
      
      console.log("logout", seccion);
      sessionStorage.removeItem("token"); //elimina el token del sessionStorage
      window.location.href = '/login'; //redirige a la vista de login
    }
    console.log('Sidebar emitió sección:', seccion);
    this.seccionSeleccionada.emit(seccion);//emite el cambio de sección a la vista padre
  } 
}
