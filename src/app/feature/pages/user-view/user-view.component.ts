import { Component, OnInit } from '@angular/core';
import { NavComponent } from '../../../shared/nav/nav.component';
import { CommonModule } from '@angular/common';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';
import { LoginService } from '../../../core/services/login/login.service';

@Component({
  selector: 'app-user-view',
  imports: [NavComponent, CommonModule, PersonalDetailsComponent],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css'
})
export class UserViewComponent implements OnInit{
  userLoginOn: boolean = false;
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn; //almacena el estado del login en la variable userLoggedIn
      },
    });
  }

}
