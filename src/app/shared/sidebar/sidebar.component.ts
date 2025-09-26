import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ComunicacionService } from '../../core/services/comunicacion/comunicacion.service';
import { LoginService } from '../../core/services/login/login.service';
import { jwtDecode } from 'jwt-decode';

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

    userName: string = '';

  constructor(
    private comunicacionsv: ComunicacionService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    // suscribirse al observable del servicio de comunicación
    this.comunicacionsv.seccion$.subscribe((seccion: string) => {
      this.cambiarSeccion(seccion);
    });

    this.loginService.userData.subscribe(token => {
      if (token) {
        try {
          const decodedToken: any = jwtDecode(token);
          this.userName = decodedToken.nombre;
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    });
  }

  cambiarSeccion(seccion: string) {
    if (seccion === "logout") {
      this.loginService.logout();
      window.location.href = '/login';
    }
    console.log('Sidebar emitió sección:', seccion);
    this.seccionSeleccionada.emit(seccion);//emite el cambio de sección a la vista padre
  }
}
