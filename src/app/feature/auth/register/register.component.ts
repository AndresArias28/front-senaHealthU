import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent  {
  register;
  showPassword = false;
  @Input() tipoUsuario!: string; 
  

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.register = this.fb.group({ 
      nombreAdmin: ['', [Validators.required]],
      apellidoAdmin: ['', [Validators.required]],
      emailAdmin: ['', [Validators.required, Validators.email, 
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') 
      ]],
      contrasenaAdmin: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      cedulaAdmin: ['', [Validators.required, Validators.minLength(6)]],
    }, { 
      validators: [this.passwordMatchValidator] 
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password: any = form.get('contrasenaAdmin');
    const confirmPassword: any = form.get('confirmPassword');

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  get nombre() {
    return this.register.controls['nombreAdmin']; 
  }

  get apellidoAdmin() {
    return this.register.get('apellidoAdmin');  
  }

  get emailAdmin() {
    return this.register.controls['emailAdmin'];
  }

  get contrasenaAdmin() {
    return this.register.get('contrasenaAdmin');
  }

  get cedula(){
    return this.register.get('cedulaAdmin');
  }

  onSubmit() {
    if (this.register.valid) {
      
      // Aquí implementarías la lógica de registro
    }
  }

}
