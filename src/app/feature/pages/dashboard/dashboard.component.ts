import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavComponent } from '../../../shared/nav/nav.component';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { DashboardGraphicsComponent } from '../dashboard-graphics/dashboard-graphics.component';
import { ProgramadorComponent } from '../programador-qr/programador.component';
import { RegisterRutineComponent } from '../register-rutine/register-rutine.component';
import { DashboardExercisesComponent } from '../dashboard-exercises/dashboard-exercises.component';
import { GestionarAsignacionComponent } from '../gestionar-asignacion/gestionar-asignacion.component';
import { DashboardAdminComponent } from "../dashboard-admin/dashboard-admin.component";


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    DashboardGraphicsComponent,
    ProgramadorComponent,
    RegisterRutineComponent,
    DashboardExercisesComponent,
    GestionarAsignacionComponent,
    DashboardAdminComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})

export class DashboardComponent {

  seccionActual: string = 'panelAdmin';

  constructor() {}

  cambiarSeccion(seccion: string) {
    console.log('dashh sexxion cambiada a ', seccion);
    this.seccionActual = seccion;
  }

  redirigirAGestionUsuarios() {
    this.seccionActual = 'gestionUsers'; // cambio manual tras registrar rutina
    console.log('Redirigido a gestionUsers tras registrar rutina');
  }
  redirigirADashboard() {
    this.seccionActual = 'gestionUsers'; // cambio manual tras eliminar rutina
    console.log('Redirigido a gestionUsers tras eliminar rutina');
  
  }

  redirigirAGestionEjercicios() {
    this.seccionActual = 'gestionEjercicios';
    console.log('Redirigido a gestion Ejercicios ');
  }
}
