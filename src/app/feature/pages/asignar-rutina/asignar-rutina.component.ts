import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  formularioAsignarRutina: any;
  mensajeExito: string = '';
  ejercicios: any[] = [];
  usuarios: any[] = [];
  observaciones: string = '';
  rutinas: any[] = [];
  idPersona: number = 0;
  idRutina: number = 0;
  idRutinaSeleccionada: number = 0;
  diaSemana: string = '';

  dias: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private asignaRutinaService: AsignarRutinaService,
    private rutineService: RutineService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {
    this.formularioAsignarRutina = this.formBuilder.group({
      idPersona: ['', Validators.required],
      observaciones: [''],
      rutinas: this.formBuilder.array([]),
      usuarios: this.formBuilder.array([]),
      fechaAsignacion: [new Date()],
      diasAsignado: this.formBuilder.array(
        this.dias.map(() => false), // inicializar todos los dias como no seleccionados
        Validators.required
      ),
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

    this.idRutinaSeleccionada = +this.route.snapshot.paramMap.get('id')!;
    // console.log('ID de la rutina recibida:', this.idRutinaSeleccionada);
  }

  asignarRutina() {
    if (this.formularioAsignarRutina.valid) {
      const seleccionados = this.formularioAsignarRutina.value.diasAsignado
        .map((checked: boolean, i: number) => (checked ? this.dias[i] : null))
        .filter((v: string | null) => v !== null);

        const diasString = seleccionados.join(', ');

      const datos = {
        observaciones: this.formularioAsignarRutina.value.observaciones,
        rutinas: this.formularioAsignarRutina.value.rutinas,
        usuarios: this.formularioAsignarRutina.value.usuarios,
        fechaAsignacion: this.formularioAsignarRutina.value.fechaAsignacion,
        idPersona: this.formularioAsignarRutina.value.idPersona,
        idRutina: this.idRutinaSeleccionada,
        diasAsignado: diasString,
      };

      this.asignaRutinaService.asignarRutina(datos).subscribe({
        next: (response) => {
          this.mensajeExito = 'rutina asignada exitosamente';
          setTimeout(() => {
            console.log('rutina asignada exitosamente:', response);
            this.mensajeExito = '';
            this.router.navigate(['/inicio-admin']);
          }, 1000);
        },
        error: (error) => {
          console.error('Error al asignar la rutina:', error);
        },
        complete: () => {
          console.log('Asignación de rutina completada');
          this.formularioAsignarRutina.reset();
        },
      });
    } else {
      console.log('Formulario inválido');
    }
  }

  get diasAsignadoFormArray() {
    return this.formularioAsignarRutina.get('diasAsignado');
  }
}
