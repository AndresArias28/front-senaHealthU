import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login/login.service';
import { LoginRequest } from '../../../shared/models/loginRequest';
import { toast } from 'ngx-sonner';
import { RecuperarContrasenaComponent } from '../recuperar-contrasena/recuperar-contrasena.component';
declare var window: any;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, RecuperarContrasenaComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent implements OnInit {

  // esto es para el modal de recuperar contraseña
  @ViewChild(RecuperarContrasenaComponent) recuperarComponent!: RecuperarContrasenaComponent;//esto es para el modal de recuperar contraseña

  contrasenaIngresada: string = '';
  loginError: string = '';
  loginForm;
  message: string = '';
  showPassword = false;
  correoIngresado: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router, 
    private loginService: LoginService,
    // private ngZone: NgZone 

  ) { //validaciones del formulario reactivo
    this.loginForm = this.formBuilder.group({
      emailUsuario: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') ]],
      contrasenaUsuario: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  login() {  
    //formularios reactivos
    if (this.loginForm.valid) {//validar el formulario
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({//
        next: (data) => {
          const rol = this.loginService.getRole();
          console.log('Rol obtenido:', rol);

          // Redirigir según el rol
          if (rol == 'ROLE_Administrador') {
            console.log("deberia entrar aca");
              this.router.navigate(['/inicio-admin']);
          } else if (rol === 'ROLE_Superusuario') {
              this.router.navigate(['/inicio-super']);
          } else {
            toast.error('rol de usuario no autorizado');
            this.router.navigate(['/iniciar-sesion']);
          } 
        },
        error: (error) => {
          console.log(error.message);
          this.loginError = error.message;//almacenar en loginError el mensaje de error que es mostrado en el html

        },
        complete: () => {
          console.log('complete');
          this.loginForm.reset();// resetea el formulario para  que no se muestre el error
        }
      })

    } else {
      this.loginForm.markAllAsTouched();
      this.loginError = 'Error en el formulario';
    }
  }

  ngAfterViewInit() {//e ol que hace es abrir el modal al hacer click en el boton de recuperar contraseña
    this.recuperarComponent.modalAbierto.subscribe(() => {
      this.mostrarModal();
    });
  }

  mostrarModal() {
    const modalElement = document.getElementById('modalRecuperar');
    if (modalElement) {
      const modal = new window.bootstrap.Modal(modalElement);
      modal.show();
    }

    modalElement?.addEventListener('hidden.bs.modal', () => {
      this.eliminarBackdrop();
    });
    
  }

  eliminarBackdrop() {
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
      document.body.classList.remove('modal-open'); // Elimina la clase que bloquea la pantalla
    }
  }

  abrirModalDesdeLogin() {
    this.recuperarComponent.abrirModal();
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  get email() {
    return this.loginForm.controls.emailUsuario;
  }

  get password() {
    return this.loginForm.controls.contrasenaUsuario;
  }

}
