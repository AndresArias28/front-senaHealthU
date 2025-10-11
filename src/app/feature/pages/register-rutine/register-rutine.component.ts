import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  Form,
  FormGroup,
  FormArray,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RutineService } from '../../../core/services/rutine/rutine.service';

@Component({
  selector: 'app-register-rutine',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-rutine.component.html',
  styleUrl: './register-rutine.component.css',
})
export class RegisterRutineComponent implements OnInit {
  @Output() rutinaRegistrada = new EventEmitter<void>(); // Emite cambios al padre
  mensajeExito: String = '';
  fotoRutina: String = '';
  idEjercicio: number = 0;
  cantidadEjercicios: number = 0;
  formularioRutina!: FormGroup;
  archivoSeleccionado: File | null = null;
  ejercicios: any[] = [];
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private rutineService: RutineService
  ) {
    this.formularioRutina = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fotoRutina: [''],
      enfoque: ['', [Validators.required]],
      dificultad: ['', [Validators.required]],
      ejercicios: this.formBuilder.array([], this.ejerciciosUnicosValidator),
      cantidadEjercicios: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.rutineService.getAllExcercises().subscribe({
      next: (ejercicios) => {
        this.ejercicios = ejercicios;
      },
      error: (error) => {
        console.error('Error al obtener ejercicios:', error);
      },
    });
    this.actualizarCamposEjercicios(1);
  }

  registerRutine() {
    if (this.formularioRutina.valid && this.archivoSeleccionado) {
      const datos = {
        nombre: this.formularioRutina.value.nombre,
        descripcion: this.formularioRutina.value.descripcion,
        enfoque: this.formularioRutina.value.enfoque,
        dificultad: this.formularioRutina.value.dificultad,
        cantidadEjercicios: this.formularioRutina.value.cantidadEjercicios,
        ejercicios: this.formularioRutina.value.ejercicios,
      };

      const formData = new FormData();

      formData.append(
        'datos',
        new Blob([JSON.stringify(datos)], { type: 'application/json' })
      );

      formData.append('fotoRutina', this.archivoSeleccionado);

      this.rutineService.registerRutine(formData).subscribe({
        next: (response) => {
          this.mensajeExito = 'Rutina registrada exitosamente';
          setTimeout(() => {
            this.rutinaRegistrada.emit();
            this.mensajeExito = '';
            this.router.navigate(['/inicio-admin']);
          }, 1000);
        },
        error: (error) => {
          this.mensajeExito = 'Error al registrar la rutina';
        },

        complete: () => {
          this.formularioRutina.reset();
          this.archivoSeleccionado = null;
        },
      });
    } else {
      this.mensajeExito = 'Formulario inválido';
    }
  }

  ejerciciosUnicosValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!(control instanceof FormArray)) {
      return null;
    }

    const ids = control.controls.map((c) => c.get('idEjercicio')?.value);
    const idsFiltrados = ids.filter((id: any) => id !== null && id !== '');
    const setIds = new Set(idsFiltrados);

    return setIds.size !== idsFiltrados.length
      ? { ejerciciosDuplicados: true }
      : null;
  };

  actualizarCamposEjercicios(cantidad: number) {
    const ejerciciosArray = this.formularioRutina.get(
      'ejercicios'
    ) as FormArray;
    ejerciciosArray.clear();

    for (let i = 0; i < cantidad; i++) {
      ejerciciosArray.push(
        this.formBuilder.group({
          nombreEjercicio: [''],
          repeticion: [''],
          series: [''],
          carga: [''],
          duracion: ['', [Validators.required]],
          idEjercicio: [''],
        })
      );
    }
  }

  onCantidadChange(event: any) {
    const cantidad = parseInt(event.target.value, 10);
    this.actualizarCamposEjercicios(cantidad);
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrl = reader.result;
        this.fotoRutina = e.target.result; //almacenar la imagen en una variable
        this.archivoSeleccionado = file; // almacena el archivo seleccionado
      };
      reader.readAsDataURL(file);
    }
  }

  get ejerciciosFormArray(): FormArray {
    return this.formularioRutina.get('ejercicios') as FormArray; // acceder a los ejercicios
  }


  volverDashboard(): void {
    this.router.navigate(['/inicio-admin']);
  }
}
