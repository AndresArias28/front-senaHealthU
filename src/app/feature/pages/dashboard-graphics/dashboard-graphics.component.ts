import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration  } from 'chart.js/auto';
import { LoginService } from '../../../core/services/login/login.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard-graphics',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard-graphics.component.html',
  styleUrl: './dashboard-graphics.component.css'
})

export class DashboardGraphicsComponent  implements OnInit, OnChanges {
  @Input() tipoUsuario!: string;
  userLoginOn: boolean = false;
  datos = [
    { id: 1, nombre: 'Juan', edad: 25, foto: 'foto1.png', correo: 'juan@gmail.com' },
    { id: 2, nombre: 'María', edad: 30, foto: 'foto2.png', correo: 'maria@gmail.com' },
    { id: 3, nombre: 'Luis', edad: 28, foto: 'foto3.png', correo: 'luis@gmail.com'  }
  ];

  seleccionados: number[] = [];

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {// se ejecuta una sola vez al cargar el componente en el DOM del navegador

    this.loginService.currentUserLoginOn.subscribe({//se suscribe al observable currentUserLoginOn al iniciar el componente
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn; //almacena el estado del login en la variable userLoggedIn
      },
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tipoUsuario'] && this.tipoUsuario) {
      console.log("Tipo de usuario actualizado:", this.tipoUsuario);
    }
  }

  toggleSeleccion(id: number) {
    const index = this.seleccionados.indexOf(id);
    if (index > -1) {
      this.seleccionados.splice(index, 1);
    } else {
      this.seleccionados.push(id);
    }
  }

  eliminarSeleccionados() {
    this.datos = this.datos.filter(d => !this.seleccionados.includes(d.id));
    this.seleccionados = [];
    
  }
}
