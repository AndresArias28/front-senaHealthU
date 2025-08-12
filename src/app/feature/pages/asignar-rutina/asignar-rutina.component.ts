import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AsignarRutinaService } from '../../../core/services/asignarCitas/asignar-rutina.service';
import { RutineService } from '../../../core/services/rutine/rutine.service';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-asignar-rutina',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './asignar-rutina.component.html',
  styleUrl: './asignar-rutina.component.css',
})
export class AsignarRutinaComponent implements OnInit {
  formularioAsignarRutina: any; // Define el tipo adecuado para tu formulario
  mensajeExito: string = '';
  ejercicios: any[] = [];
  usuarios: any[] = [];
  observaciones: string = '';
  rutinas: any[] = [];
  idPersona: number = 0;
  idRutina: number = 0;
  diaSemana: string = '';
  
  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private asignaRutinaService: AsignarRutinaService,
    private rutineService: RutineService,
    private userService: UserService
  ) {
    this.formularioAsignarRutina = this.formBuilder.group({
      idPersona: ['', Validators.required],
      idRutina: ['', Validators.required],
      observaciones: [''],
      rutinas: this.formBuilder.array([]),
      usuarios: this.formBuilder.array([]),
      fechaAsignacion: [new Date()],
    });
  }

  ngOnInit() {
    this.rutineService.getAllExcercises().subscribe({
      next: (ejercicios) => {
        console.log('Ejercicios obtenidos:', ejercicios);
        this.ejercicios = ejercicios;
      },
      error: (error) => {
        console.error('Error al obtener ejercicios:', error);
      },
    });

    this.userService.geAllUsers().subscribe({
      next: (usuarios) => {
        console.log('Usuarios obtenidos:', usuarios);
        this.usuarios = usuarios;
      },
      error: (error) => {
        console.error('Error al obtener usuarios:', error);
      },
    });

    this.rutineService.getAllRutines().subscribe({
      next: (rutinas) => {
        console.log('Rutinas obtenidas:', rutinas);
        this.rutinas = rutinas;
      },
      error: (error) => {
        console.error('Error al obtener rutinas:', error);
      },
    });
  }

  asignarRutina() {
    if (this.formularioAsignarRutina.valid) {
      const datos = {
        observaciones: this.formularioAsignarRutina.value.observaciones,
        rutinas: this.formularioAsignarRutina.value.rutinas,
        usuarios: this.formularioAsignarRutina.value.usuarios,
        fechaAsignacion: this.formularioAsignarRutina.value.fechaAsignacion,
        idPersona: this.formularioAsignarRutina.value.idPersona,
        idRutina: this.formularioAsignarRutina.value.idRutina,
      };

      this.asignaRutinaService.asignarRutina(datos).subscribe({
        next: (response) => {
          this.mensajeExito = 'rutina asignada exitosamente';
          setTimeout(() => {
            console.log('rutina asignada exitosamente:', response);
            this.mensajeExito = '';
            // this.router.navigate(['/inicio-admin']);
            //recargar la pagina
            window.location.reload();
          }, 1000);
        },
        error: (error) => {
          console.error('Error al asignar la rutina:', error);
        },
        complete: () => {
          console.log('Asignación de rutina completada');
          this.formularioAsignarRutina.reset(); // Resetea el formulario después de asignar
        },
      });
    } else {
      console.log('Formulario inválido');
    }
  }
}
