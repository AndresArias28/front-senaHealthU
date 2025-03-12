import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {

  @Input() seccionActual!: string  //Definite Assignment Assertion - recibe cambios del padre
  @Output() seccionSeleccionada = new EventEmitter<string>(); // Emite cambios aL padre

  cambiarSeccion(seccion: string) {
    console.log('Sidebar emitió sección:', seccion);
    this.seccionSeleccionada.emit(seccion);//emite el cambio de sección a la vista padre
  } 
}
