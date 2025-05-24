import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  @Input() seccionActual!: string  //Definite Assignment Assertion - recibe cambios del padre
  @Input() tipoUsuario!: string; 
  @Output() seccionSeleccionada = new EventEmitter<string>(); // Emite cambios aL padre

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
