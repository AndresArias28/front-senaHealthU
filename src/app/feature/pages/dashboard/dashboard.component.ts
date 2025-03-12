import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavComponent } from '../../../shared/nav/nav.component';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../core/services/login/login.service';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
//import { User } from '../../../shared/models/user';
//import { PersonalDetailsComponent } from "../personal-details/personal-details.component";

@Component({
  selector: 'app-dashboard',
  imports: [NavComponent, CommonModule, SidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  
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
