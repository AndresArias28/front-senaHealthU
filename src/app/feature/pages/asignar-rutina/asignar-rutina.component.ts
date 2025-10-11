import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AsignarRutinaService } from '../../../core/services/asignarCitas/asignar-rutina.service';
import { UserService } from '../../../core/services/user/user.service';
import { RutineService } from '../../../core/services/rutine/rutine.service';

@Component({
  selector: 'app-asignar-rutina',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './asignar-rutina.component.html',
  styleUrl: './asignar-rutina.component.css',
})
export class AsignarRutinaComponent implements OnInit {
  formularioAsignarRutina: any;
  mensajeExito: string = '';
  mensajeError: string = '';
  usuarios: any[] = [];
  observaciones: string = '';
  idPersona: number = 0;
  idRutina: number = 0;
  idRutinaSeleccionada: number = 0;
  diaSemana: string = '';
  rutinas: any[] = [];
  nombreRutinaSeleccionada: string = '';

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
    private userService: UserService,
    private route: ActivatedRoute,
    private rutineSer: RutineService
  ) {
    this.formularioAsignarRutina = this.formBuilder.group({
      idPersona: ['', Validators.required],
      observaciones: [''],
      diasAsignado: this.formBuilder.array(
        this.dias.map(() => false), // inicializar todos los dias como no seleccionados
        Validators.required
      ),
    });
  }

  ngOnInit() {
    this.rutineSer.getAllRutines().subscribe({
      next: (rutinas) => {
        this.rutinas = rutinas;
        this.nombreRutinaSeleccionada = this.rutinas.find(
          (r) => r.idRutina === this.idRutinaSeleccionada
        )?.nombre;

      },
    });

    this.userService.geAllUsers().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
      },
      error: (error) => {
        this.mensajeError = 'Error al obtener usuarios. Por favor, intente nuevamente.';
      },
    });

    this.idRutinaSeleccionada = +this.route.snapshot.paramMap.get('id')!;
  }

  asignarRutina() {
    if (this.formularioAsignarRutina.valid) {
      const seleccionados = this.formularioAsignarRutina.value.diasAsignado
        .map((checked: boolean, i: number) => (checked ? this.dias[i] : null))
        .filter((v: string | null) => v !== null);

        const diasString = seleccionados.join(', ');

      const datos = {
        observaciones: this.formularioAsignarRutina.value.observaciones,
        usuarios: this.formularioAsignarRutina.value.usuarios,
        idPersona: this.formularioAsignarRutina.value.idPersona,
        idRutina: this.idRutinaSeleccionada,
        diasAsignado: diasString,
      };

      this.asignaRutinaService.asignarRutina(datos).subscribe({
        next: (response) => {
          this.mensajeExito = 'rutina asignada exitosamente';
          setTimeout(() => {
            this.mensajeExito = '';
            this.router.navigate(['/inicio-admin']);
          }, 1000);
        },
        error: (error) => {
          this.mensajeError = 'Error al asignar la rutina. Por favor, intente nuevamente.';
        },
        complete: () => {
          this.formularioAsignarRutina.reset();
        },
      });
    } else {
      this.formularioAsignarRutina.markAllAsTouched();
      this.mensajeError = 'Por favor, complete todos los campos requeridos.';
    }
  }

  get diasAsignadoFormArray() {
    return this.formularioAsignarRutina.get('diasAsignado');
  }
}
