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
          this.message = 'Si el correo existe, se ha enviado un enlace de recuperación';
        },
        error: (error) => {
    
          this.message = 'Si el correo existe, se ha enviado un enlace de recuperación';
        },
        complete: () => {
          this.message = 'Si el correo existe, se ha enviado un enlace de recuperación';
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
    this.modalAbierto.emit();
  }

  recuperarContrasena() {
    if(this.correoIngresado === '') {
      this.message = 'Por favor ingrese un correo'; 
    }
  }

}
