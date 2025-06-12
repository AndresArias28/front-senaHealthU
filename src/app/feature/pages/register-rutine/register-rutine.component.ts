import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, Form, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../core/services/login/login.service';
import { CommonModule } from '@angular/common';
import { RutineService } from '../../../core/services/rutine/rutine.service';

@Component({
  selector: 'app-register-rutine',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-rutine.component.html',
  styleUrl: './register-rutine.component.css'
})
export class RegisterRutineComponent implements OnInit {

  @Output() rutinaRegistrada = new EventEmitter<void>(); // Emite cambios al padre
  mensajeExito: String = '';

  nombre: String = '';
  descripcion: String = '';
  fotoRutina: String = '';
  enfoque: String = '';
  idEjercicio: number = 0;
  dificultad: String = '';
  series: String = '';
  repeticion: String = '';
  carga: String = '';
  duracion: String = '';
  cantidadEjercicios: number = 0;
  formularioRutina!: FormGroup;

  ejercicios: any[] = [
    { id: 1, nombre: 'Ejercicio 1' },
    { id: 2, nombre: 'Ejercicio 2' },
    { id: 3, nombre: 'Ejercicio 3' },
    { id: 4, nombre: 'Ejercicio 4' },
  ];

  constructor(private formBuilder: FormBuilder, private router: Router, private rutineService: RutineService) {
    this.formularioRutina = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fotoRutina: [''],
      enfoque: ['', [Validators.required]],
      dificultad: ['', [Validators.required]],
      ejercicios: this.formBuilder.array([ ]),
      cantidadEjercicios: ['', [Validators.required]],

    });
  }

  ngOnInit() {
    // inicializar con uno por defecto
    this.actualizarCamposEjercicios(1);

  }

  //guardar la rutina - comunicar con el servicio
  registerRutine() {
    if (this.formularioRutina.valid) {

      this.rutineService.registerRutine(this.formularioRutina.value).subscribe({
        next: (response) => {
          this.mensajeExito = 'Rutina registrada exitosamente';
          setTimeout( () => {
            console.log('Rutina registrada exitosamente:', response);
            this.rutinaRegistrada.emit(); // emitir evento al padre
            this.mensajeExito = ''; //limpiar mensaje de exito
             
          }, 2000); 
        },
        error: (error) => {
          console.error('Error al registrar la rutina:', error);
        },

        complete: () => {
          console.log('Registro de rutina completado');
          this.formularioRutina.reset(); // Resetea el formulario después de registrar
        }
      });

    } else {
      console.log('Formulario inválido');
    }
  }


  actualizarCamposEjercicios(cantidad: number) {
    // Limpiar el FormArray antes de agregar nuevos controles
    const ejerciciosArray = this.formularioRutina.get('ejercicios') as FormArray;
    ejerciciosArray.clear(); // limpiar anteriores

    // Agregar nuevos controles al FormArray - cantidad de ejercicios

    for (let i = 0; i < cantidad; i++) {
      ejerciciosArray.push(this.formBuilder.group({
        nombreEjercicio: [''],
        repeticiones: [''],
        series: [''],
        carga: [''],
        duracion: ['', [Validators.required]],
        idEjercicio: [''],

      }));
    }
  }

  onCantidadChange(event: any) {
    const cantidad = parseInt(event.target.value, 10);
    this.actualizarCamposEjercicios(cantidad);
  }

  //metodo para la seleccion de archivos
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoRutina = e.target.result; // Aquí puedes almacenar la imagen en una variable
      };
      reader.readAsDataURL(file);
    }
  }

  //metodo para la seleccion de ejercicios 
  get ejerciciosFormArray(): FormArray { 
    return this.formularioRutina.get('ejercicios') as FormArray; //esto es para acceder a los ejercicios
  } 

}
