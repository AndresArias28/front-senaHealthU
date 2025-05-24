import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration  } from 'chart.js/auto';
import { LoginService } from '../../../core/services/login/login.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';


@Component({
  selector: 'app-dashboard-graphics',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashboard-graphics.component.html',
  styleUrl: './dashboard-graphics.component.css'
})

export class DashboardGraphicsComponent  implements OnInit, OnChanges {
  @Input() tipoUsuario!: string;
  userLoginOn: boolean = false;
  terminoBusqueda: string = '';
  datos: any[] = []; // Cambia el tipo de datos según tu necesidad
  // datos = [
  //   { id: 1, nombre: 'Juan', edad: 25, foto: 'foto1.png', correo: 'juan@gmail.com' },
  //   { id: 2, nombre: 'María', edad: 30, foto: 'foto2.png', correo: 'maria@gmail.com' },
  //   { id: 3, nombre: 'Luis', edad: 28, foto: 'foto3.png', correo: 'luis@gmail.com' },
  //   { id: 4, nombre: 'Ana', edad: 32, foto: 'foto4.png', correo: 'ana@gmail.com' },
  //   { id: 5, nombre: 'Carlos', edad: 41, foto: 'foto5.png', correo: 'carlos@gmail.com' },
  //   { id: 6, nombre: 'Sofía', edad: 27, foto: 'foto6.png', correo: 'sofia@gmail.com' },
  //   { id: 7, nombre: 'Pedro', edad: 33, foto: 'foto7.png', correo: 'pedro@gmail.com' },
  //   { id: 8, nombre: 'Laura', edad: 29, foto: 'foto8.png', correo: 'laura@gmail.com' },
  //   { id: 9, nombre: 'Miguel', edad: 36, foto: 'foto9.png', correo: 'miguel@gmail.com' },
  //   { id: 10, nombre: 'Carmen', edad: 24, foto: 'foto10.png', correo: 'carmen@gmail.com' },
  //   { id: 11, nombre: 'Javier', edad: 38, foto: 'foto11.png', correo: 'javier@gmail.com' },
  //   { id: 12, nombre: 'Isabel', edad: 31, foto: 'foto12.png', correo: 'isabel@gmail.com' },
  //   { id: 13, nombre: 'Roberto', edad: 44, foto: 'foto13.png', correo: 'roberto@gmail.com' },
  //   { id: 14, nombre: 'Elena', edad: 26, foto: 'foto14.png', correo: 'elena@gmail.com' },
  //   { id: 15, nombre: 'David', edad: 35, foto: 'foto15.png', correo: 'david@gmail.com' },
  //   { id: 16, nombre: 'Patricia', edad: 29, foto: 'foto16.png', correo: 'patricia@gmail.com' },
  //   { id: 17, nombre: 'Fernando', edad: 42, foto: 'foto17.png', correo: 'fernando@gmail.com' },
  //   { id: 18, nombre: 'Lucía', edad: 27, foto: 'foto18.png', correo: 'lucia@gmail.com' },
  //   { id: 19, nombre: 'Alberto', edad: 33, foto: 'foto19.png', correo: 'alberto@gmail.com' },
  //   { id: 20, nombre: 'Silvia', edad: 30, foto: 'foto20.png', correo: 'silvia@gmail.com' },
  //   { id: 21, nombre: 'Raúl', edad: 37, foto: 'foto21.png', correo: 'raul@gmail.com' },
  //   { id: 22, nombre: 'Cristina', edad: 28, foto: 'foto22.png', correo: 'cristina@gmail.com' },
  //   { id: 23, nombre: 'Alejandro', edad: 34, foto: 'foto23.png', correo: 'alejandro@gmail.com' }
  // ];

  seleccionados: number[] = [];
  datosFiltrados = [...this.datos]; // copia inicial
  constructor(private loginService: LoginService, private userService : UserService) {}

  ngOnInit(): void {// se ejecuta una sola vez al cargar el componente en el DOM del navegador
    this.loginService.currentUserLoginOn.subscribe({//se suscribe al observable currentUserLoginOn al iniciar el componente
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn; //almacena el estado del login en la variable userLoggedIn
      },
    });

    this.userService.geAllUsers().subscribe({//se suscribe al observable geAllUsers() al iniciar el componente
      next: (response) => {
        this.datos = response; //almacena la respuesta en la variable datos
        this.datosFiltrados = [...this.datos]; // copia inicial
      }
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

  buscar() {
    const termino = this.terminoBusqueda.trim().toLowerCase();
    if (!termino) {
      this.datosFiltrados = [...this.datos];
      return;
    }
    this.datosFiltrados = this.datos.filter(item =>
      item.nombre.toLowerCase().includes(termino) ||
      item.correo.toLowerCase().includes(termino)
    );
  }


}
