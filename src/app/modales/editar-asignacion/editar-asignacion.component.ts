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
import { MatIcon } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

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
export class EditarAsignacionComponent {
  @Output() asignacionActualizada: any;

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
  nivelesFisicos = ['Principiante', 'Intermedio', 'Avanzado'];
  rutinasDisponibles = [
    { id: 1, nombre: 'Piernas de Acero' },
    { id: 2, nombre: 'Pecho Potente' },
    { id: 3, nombre: 'Hombros Explosivos' },
    { id: 4, nombre: 'Cardio Total' },
  ];

  // Objeto para manejar rutinas por día
  rutinasAsignadas: { [dia: string]: string } = {};
  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditarAsignacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Inicializa rutinas asignadas (si vienen desde el backend)
    this.dias.forEach((dia) => {
      this.rutinasAsignadas[dia] = data.nombreRutina || '';
    });
  }

  guardar(): void {
    const asignacionActualizada = {
      ...this.data,
      observaciones: this.data.observaciones,
      diasAsignado: this.rutinasAsignadas,
    };

    this.dialogRef.close(asignacionActualizada);
  }
}
