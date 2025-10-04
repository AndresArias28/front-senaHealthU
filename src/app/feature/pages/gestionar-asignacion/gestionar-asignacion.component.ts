import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutineService } from '../../../core/services/rutine/rutine.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditarAsignacionComponent } from '../../../modales/editar-asignacion/editar-asignacion.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Asignacion {
  id: number;
  nombreAprendiz: string;
  ficha: string;
  fechaCreacion: Date;
  nivelFisico: string;
  observaciones?: string;
  diasAsignado?: string[];
  nombreRutina?: string;
}

@Component({
  selector: 'app-gestionar-asignacion',
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSnackBarModule,
  ],
  templateUrl: './gestionar-asignacion.component.html',
  styleUrl: './gestionar-asignacion.component.css',
})
export class GestionarAsignacionComponent {
  asignaciones: Asignacion[] = [];

  constructor(
    private rutineService: RutineService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.rutineService.getAllAsinacionRutines().subscribe({
      next: (asignaciones) => {
        this.asignaciones = asignaciones;
      },
      error: (error) => {
        console.error('Error al obtener las asignaciones:', error);
      },
    });
  }

  editarAsignacion(asignacion: Asignacion): void {
    const dialogRef = this.dialog.open(EditarAsignacionComponent, {
      width: '800px',
      height: '70vh',

      disableClose: false,
      autoFocus: true,
      data: { ...asignacion },
    });

    const instance = dialogRef.componentInstance;

    instance.asignacionActualizada.subscribe(() => {
      this.ngOnInit(); 
    });
    
    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.actualizado) {
       this.mostrarMensaje('Asignación actualizada correctamente', 'success');
        return;
      }

      if (resultado && resultado.id) {
        this.mostrarMensaje('Asignación actualizada correctamente', 'success');
        return;
      }
    });


  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error' = 'success') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass:
        tipo === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    });
  }

  
}
