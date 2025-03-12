import { Component } from '@angular/core';
import { NavComponent } from '../../../shared/nav/nav.component';
import { LoginService } from '../../../core/services/login/login.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { DashboardGraphicsComponent } from "../dashboard-graphics/dashboard-graphics.component";

@Component({
  selector: 'app-dashboard-superusuario',
  imports: [NavComponent, CommonModule, SidebarComponent, DashboardGraphicsComponent],
  templateUrl: './dashboard-superusuario.component.html',
  styleUrl: './dashboard-superusuario.component.css',
})
export class DashboardSuperusuarioComponent {
  seccionActual: string = 'dashboard'; 
  userLoginOn: boolean = false;
  title = 'admin-dashboard';
  //userData?: User;

  constructor(private loginService: LoginService) {}

  cambiarSeccion(seccion: string) {
    console.log('dashh sexxion cambiada a ', seccion);
    this.seccionActual = seccion;
  }

 // ngOnInit(): void {
    // se ejecuta una sola vez al cargar el componente en el DOM del navegador

    // this.loginService.currentUserLoginOn.subscribe({
    //   //se suscribe al observable currentUserLoginOn al iniciar el componente
    //   next: (userLoginOn) => {
    //     this.userLoginOn = userLoginOn; //almacena el estado del login en la variable userLoggedIn
    //   },
    // });
  //}


}
