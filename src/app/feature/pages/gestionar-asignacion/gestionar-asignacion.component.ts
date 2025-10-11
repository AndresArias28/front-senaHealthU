import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutineService } from '../../../core/services/rutine/rutine.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { EditarAsignacionComponent } from '../../../modales/editar-asignacion/editar-asignacion.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Swal from 'sweetalert2/dist/sweetalert2.js';


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
  standalone: true,
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
export class GestionarAsignacionComponent implements OnInit {
  asignaciones: Asignacion[] = [];
  cargando: boolean = false;

  constructor(
    private rutineService: RutineService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarAsignaciones();
  }

  /** carga las asignaciones únicas (sin duplicados de aprendiz) */
  private cargarAsignaciones(): void {
    this.cargando = true;
    this.rutineService.getAllAsinacionRutines().subscribe({
      next: (asignaciones) => {
        const asignacionesUnicas = Array.from(
          new Map(asignaciones.map((a) => [a.idPersona, a])).values()
        );
        this.asignaciones = asignacionesUnicas;
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener las asignaciones:', error);
        this.mostrarMensaje('Error al obtener las asignaciones', 'error');
        this.cargando = false;
      },
    });
  }

  /** 🌀 Recarga manual (para botón “Actualizar”) */
  recargarAsignaciones(): void {
    this.cargando = true;
    this.rutineService.getAllAsinacionRutines().subscribe({
      next: (data) => {
        const asignacionesUnicas = Array.from(
          new Map(data.map((a) => [a.idPersona, a])).values()
        );
        this.asignaciones = asignacionesUnicas;
        this.cargando = false;

        Swal.fire({
          title: '¡Actualizado!',
          text: 'Las asignaciones se han recargado correctamente.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
        });
      },
      error: (error) => {
        this.cargando = false;
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron obtener las asignaciones.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  /** modal para editar una asignación */
  editarAsignacion(asignacion: Asignacion): void {
    const dialogRef = this.dialog.open(EditarAsignacionComponent, {
      width: '70vw',
      maxWidth: '800px',
      maxHeight: '85vh',
      panelClass: 'dialog-md',
      disableClose: false,
      autoFocus: true,
      data: { ...asignacion },
    });

    const instance = dialogRef.componentInstance;
    instance.asignacionActualizada.subscribe(() => this.cargarAsignaciones());

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.actualizado || (resultado && resultado.id)) {
        this.mostrarMensaje('Asignación actualizada correctamente', 'success');
      }
    });
  }

  /**Muestra notificación */
  private mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' = 'success'
  ): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass:
        tipo === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    });
  }
}
