import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../core/services/login/login.service';


@Component({
  selector: 'app-recuperar-contrasena',
  imports: [FormsModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})

export class RecuperarContrasenaComponent {

  correoIngresado: string = '';
  message: string = '';

  constructor( private loginService: LoginService) { }

  recoverPassword() {
    if (this.correoIngresado != '') {
      this.loginService.recoverPassword(this.correoIngresado).subscribe({
        next: (data) => {
          console.log('Recuperar contraseña del correo:', data);
        },
        error: (error) => {
          console.log(error.message);
        },
        complete: () => {
          console.log('complete');
        }
      });
    }else{
      this.message = 'Por favor ingrese un correo';
    }
  }
 

  validarTextoIngresado() {
    throw new Error('Method not implemented.');
  }

  @Output() modalAbierto = new EventEmitter<void>();

  abrirModal() {
    this.modalAbierto.emit(); // Envia el evento al padre (LoginComponent)
  }

  recuperarContrasena() {
    if(this.correoIngresado === '') {
      this.message = 'Por favor ingrese un correo'; 
    }
  }

}
