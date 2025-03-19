import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css'
})
export class RegisterUserComponent {
  showPassword = false;
  registerUser: any;
  // passwordMatchValidator: any;
  
  constructor(private fb: FormBuilder) {
    this.registerUser = this.fb.group({ 
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, 
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$') 
      ]],
      passwordUser: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      cedula: ['', [Validators.required, Validators.minLength(6)]],
    }, { 
      validators: [this.passwordMatchValidator] 
    });63
  }

  onSubmitUser() {
    throw new Error('Method not implemented.');
  }

  get emailUser() {
    return this.registerUser.controls['email'];
  }

  get password() {
    return this.registerUser.controls['passwordUser'];
  }

  get confirmPassword() {
    return this.registerUser.controls['confirmPassword'];
  }

   passwordMatchValidator(form: FormGroup) {
      const password: any = form.get('passwordUser');
      const confirmPassword: any = form.get('confirmPassword');
  
      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
      } else {
        confirmPassword.setErrors(null);
      }
      return null;
    }


}
