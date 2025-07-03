import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ExcerciseServiceService } from '../../../core/services/excercise-service.service';

@Component({
  selector: 'app-register-exercise',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-exercise.component.html',
  styleUrl: './register-exercise.component.css',
})
export class RegisterExerciseComponent {
  formularioEjercicio!: FormGroup;
  nombreEjercicio: string = '';
  descripcionEjercicio: string = '';
  fotoEjercicio: string = '';
  met: number = 0;
  musculos: string = '';
  archivoSeleccionado: File | null = null;
  mensajeExito: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private exerciseService: ExcerciseServiceService
  ) {
    this.formularioEjercicio = this.formBuilder.group({
      nombreEjercicio: ['', [Validators.required]],
      descripcionEjercicio: [
        '',
        [Validators.required, Validators.minLength(10)],
      ],
      fotoEjercicio: [''],
      met: ['', [Validators.required]],
      musculos: ['', [Validators.required]],
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoEjercicio = e.target.result; // Aquí puedes almacenar la imagen en una variable
        this.archivoSeleccionado = file; // Almacena el archivo seleccionado
      };
      reader.readAsDataURL(file);
    }
  }

  registerExercise() {
    if (this.formularioEjercicio.valid && this.archivoSeleccionado) {
      const datos = {
        nombreEjercicio: this.formularioEjercicio.value.nombreEjercicio,
        descripcionEjercicio: this.formularioEjercicio.value.descripcionEjercicio,
        fotoEjercicio: this.fotoEjercicio,
        met: this.formularioEjercicio.value.met,
        musculos: this.formularioEjercicio.value.musculos,
      };

      const formData = new FormData();
      formData.append(
        'datos',
        new Blob([JSON.stringify(datos)], { type: 'application/json' })
      );
      formData.append('fotoEjercicio', this.archivoSeleccionado);

      this.exerciseService.registerExercise(formData).subscribe({
        next: (response) => {
          this.mensajeExito = 'Ejercicio registrado exitosamente';
          setTimeout(() => {
            console.log('Ejercicio registrado:', response);
            this.mensajeExito = '';
            this.router.navigate(['/inicio-admin']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error al registrar ejercicio:', error);
          this.mensajeExito = 'Error al registrar el ejercicio';
        },
        complete: () => {
          console.log('Registro de ejercicio completado');
          this.formularioEjercicio.reset();
          this.archivoSeleccionado = null;
        },
      });
    } else {
      console.log('Formulario inválido o archivo no seleccionado');
    }
  }
}
