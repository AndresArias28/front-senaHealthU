import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../shared/models/user';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user/user.service';
import { LoginService } from '../../../core/services/login/login.service';

@Component({
  selector: 'app-personal-details',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css',
})
export class PersonalDetailsComponent {

  errorMessage: String = '';
  user?: User;
  userLoginOn: boolean = false;
  editMode: boolean = false;
  registerForm : FormGroup;

  constructor( private userService: UserService, private formBuilder: FormBuilder, private loginService: LoginService ) {

    //validaciones del formulario reactivo
    this.registerForm  = formBuilder.group({
      idUsuario: [''],
      nombreUsuario: ['', Validators.required],
      emailUsuario: ['', Validators.required],
    });

    this.userService.getUser(11).subscribe({
      next: (userData) => {
        this.user = userData;
        this.registerForm.controls['idUsuario'].setValue(userData.idUsuario.toString());
        this.registerForm.controls['nombreUsuario'].setValue(userData.nombreUsuario);
        this.registerForm.controls['emailUsuario'].setValue(userData.emailUsuario);
      },
      error: (error) => {
        this.errorMessage = error;
      },
      complete: () => {
        console.info('Completado');
      },
    });

    this.loginService.userLoginOn.subscribe({
      next:(userLoginOn) => {
        this.userLoginOn=userLoginOn;
      }
    });

  }

  get firstName() {
    return this.registerForm.controls['nombreUsuario'];
  }

  get email() {
    return this.registerForm.controls['emailUsuario'];
  }

  savePersonalDetailsData(){
    if (this.registerForm.valid){
      this.userService.updateUser(this.registerForm.value as unknown as User).subscribe({
        next:() => {
          this.editMode=false;
          this.user=this.registerForm.value as unknown as User;
        },
        error:(errorData)=> console.error(errorData)
      })
    }
  }

}
