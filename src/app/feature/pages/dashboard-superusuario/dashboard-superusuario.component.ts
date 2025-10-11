import { Component } from '@angular/core';
import { LoginService } from '../../../core/services/login/login.service';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-dashboard-superusuario',
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard-superusuario.component.html',
  styleUrl: './dashboard-superusuario.component.css',
})
export class DashboardSuperusuarioComponent {
  seccionActual: string = '';
  userRol: string = 'superusuario';
  title = 'admin-dashboard';

  constructor(private loginService: LoginService) {}

  cambiarSeccion(seccion: string) {
    this.seccionActual = seccion;
  }

}
