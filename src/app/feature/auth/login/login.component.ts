import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
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
  @ViewChild(RecuperarContrasenaComponent)
  recuperarComponent!: RecuperarContrasenaComponent; 
  mensajeError: string = '';
  mensajeExito: string = '';
  contrasenaIngresada: string = '';
  loginError: string = '';
  loginForm;
  message: string = '';
  showPassword = false;
  correoIngresado: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.formBuilder.group({
      emailUsuario: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      contrasenaUsuario: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {}

  login() {
    if (this.loginForm.invalid) return;

    if (this.loginForm.valid) {
      this.loginService.login(this.loginForm.value as LoginRequest).subscribe({
        next: (data) => {
          const rol = this.loginService.getRole();

          // Redirigir segun el rol
          if (rol == 'ROLE_Administrador') {
            this.router.navigate(['/inicio-admin']);
          } else if (rol === 'ROLE_Superusuario') {
            this.router.navigate(['/inicio-super']);
          } else if (rol === 'ROLE_Aprendiz') {
            this.router.navigate(['/inicio-admin']);
          }
        },
        error: (error) => {
          this.loginError = error.message; 
          toast.error('Error al iniciar sesión: ' + this.loginError, { duration: 5000 });
        },
        complete: () => {
          this.loginForm.reset(); 
        },
      });
    } else {
      this.loginForm.markAllAsTouched(); 
      this.loginError = 'Error en el formulario';
    }
  }

  ngAfterViewInit() {
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
      document.body.classList.remove('modal-open'); // eliminar clase que bloquea la pantalla
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
