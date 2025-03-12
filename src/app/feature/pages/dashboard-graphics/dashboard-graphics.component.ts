import { Component } from '@angular/core';
import { Chart, ChartConfiguration  } from 'chart.js/auto';
import { LoginService } from '../../../core/services/login/login.service';


@Component({
  selector: 'app-dashboard-graphics',
  imports: [],
  templateUrl: './dashboard-graphics.component.html',
  styleUrl: './dashboard-graphics.component.css'
})
export class DashboardGraphicsComponent {
  userLoginOn: boolean = false;
   title = "admin-dashboard";
  //userData?: User;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {// se ejecuta una sola vez al cargar el componente en el DOM del navegador

    this.loginService.currentUserLoginOn.subscribe({//se suscribe al observable currentUserLoginOn al iniciar el componente
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn; //almacena el estado del login en la variable userLoggedIn
      },
    });

  }

}
