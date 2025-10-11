import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import {
  Asignacion,
  AsignacionRutinaDTO,
  Rutina,
} from '../../shared/models/asignacion';
import { ChangeDetectorRef } from '@angular/core';
import { forkJoin } from 'rxjs';
import { RutinaAsignacionService } from '../../core/services/rutina-asignacion/rutina-asignacion.service';
import { RutineService } from '../../core/services/rutine/rutine.service';

@Component({
  selector: 'app-editar-asignacion',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatSelectModule,
    MatCardModule,
    MatExpansionModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './editar-asignacion.component.html',
  styleUrls: ['./editar-asignacion.component.css'],
})
export class EditarAsignacionComponent implements OnInit {
  @Output() asignacionActualizada = new EventEmitter<void>();

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditarAsignacionComponent>,
    private raService: RutinaAsignacionService,
    private rutineService: RutineService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cdr: ChangeDetectorRef
  ) {  }

  asignacion = {
    nombreAprendiz: '',
    ficha: '',
    fechaCreacion: new Date(),
    nivelFisico: '',
  };

  dias: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];
  rutinasDisponibles: Rutina[] = [];

  rutinasAsignadas: Record<string, number | null> = {};

  // Map día -> asignación original (para saber si hay que crear/actualizar)
  originalesPorDia: Record<string, Asignacion | null> = {};

  cargando = true;
  error: string | null = null;

  ngOnInit(): void {
    this.cargarDatos();
  }

  trackByRutinaId = (_: number, r: Rutina) => r.idRutina;


  private cargarDatos(): void {
    const idPersona = this.data?.idPersona;
    if (!idPersona) {
      this.error = 'Falta idPersona en data del modal';
      return;
    }

    forkJoin({
      rutinas: this.rutineService.getAllRutines(),
      asignaciones: this.raService.getAsignacionesPorPersona(idPersona),
    }).subscribe({
      next: ({ rutinas, asignaciones }) => {
        this.rutinasDisponibles = rutinas;

        // Inicializa selección a null
        this.dias.forEach((d) => {
          this.rutinasAsignadas[d] = null;
          this.originalesPorDia[d] = null;
        });

        // Preselecciona lo que viene de backend
        asignaciones.forEach((a) => {
          const dia = a.diasAsignado; // Debe coincidir con "Lunes", "Martes", ...
          if (this.dias.includes(dia)) {
            this.rutinasAsignadas[dia] = a.idRutina;
            this.originalesPorDia[dia] = a;
          }
        });

        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudieron cargar datos';
        this.cargando = false;
        console.error(err);
      },
    });
  }

  guardar(): void {
    const idPersona = this.data?.idPersona;
    const observaciones = this.data?.observaciones ?? null;
    const peticiones = [];

    for (const dia of this.dias) {
      const seleccion = this.rutinasAsignadas[dia]; // idRutina o null
      const original = this.originalesPorDia[dia]; // Asignacion | null

      //hay selección y no había nada -> CREAR
      if (seleccion && !original) {
        const dto: AsignacionRutinaDTO = {
          idPersona,
          idRutina: seleccion,
          observaciones,
          diasAsignado: dia,
        };
        peticiones.push(this.raService.crearAsignacion(dto));
      }

      //hay selección y cambió respecto al original -> ACTUALIZAR
      if (seleccion && original && original.idRutina !== seleccion) {
        const dto: AsignacionRutinaDTO = {
          idPersona,
          idRutina: seleccion,
          observaciones,
          diasAsignado: dia,
        };
        peticiones.push(
          this.raService.actualizarAsignacion(original.idAsignacion, dto)
        );
      }

      //quitar rutina si seleccion == null y antes había una -> ELIMINAR
      if (!seleccion && original) {
        peticiones.push(
          this.raService.eliminarAsignacion(original.idAsignacion)
        );
      }
    }

    if (peticiones.length === 0) {
      this.dialogRef.close({ actualizado: false });
      return;
    }

    forkJoin(peticiones).subscribe({
      next: (_) => this.dialogRef.close({ actualizado: true }),
      error: (err) => {
        console.error(err);
        this.error = 'Error guardando cambios';
      },
    });
  }

}
