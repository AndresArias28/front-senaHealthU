import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavComponent } from '../../../shared/nav/nav.component';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/services/login/login.service';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { DashboardGraphicsComponent } from '../dashboard-graphics/dashboard-graphics.component';
import { ProgramadorComponent } from '../programador/programador.component';
//import { User } from '../../../shared/models/user';
//import { PersonalDetailsComponent } from "../personal-details/personal-details.component";

@Component({
  selector: 'app-dashboard',
  imports: [NavComponent, CommonModule, SidebarComponent, 
    DashboardGraphicsComponent, ProgramadorComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent {
  seccionActual: string = 'administrador';

  //@Input() tipoUsuario!: string; 
  //userData?: User;

  constructor(private loginService: LoginService) {}

  cambiarSeccion(seccion: string) {
    console.log('dashh sexxion cambiada a ', seccion);
    this.seccionActual = seccion;
  }
}
