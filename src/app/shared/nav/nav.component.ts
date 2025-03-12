import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from '../../core/services/login/login.service';

@Component({
  selector: 'app-nav',
  imports: [
    CommonModule, RouterOutlet, RouterLink
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnInit {

  userLoggedIn: boolean = false;

  //Siempre el servicio de login se inyecta en el constructor para poder acceder a sus propiedades
  constructor(private loginService: LoginService, private router: Router) { }


  ngOnInit(): void {
    //suscribirse al observable que emite el estado del login
    this.loginService.currentUserLoginOn.subscribe({
       next: (usuarioLogeado) => {
        this.userLoggedIn = usuarioLogeado;//almacena el estado del login en la variable userLoggedIn
      }
    });
  }

  //metodo para cerrar sesion
  logout() {
    this.loginService.logout();//llamar al metodo logout del servicio de login
    this.loginService.currentUserLoginOn.next(false);//emitir el estado del login a los componentes suscritos
    this.router.navigate(['/iniciar-sesion']);//redirigir a la pagina de login
  }

}
