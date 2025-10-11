import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditarEjercicoComponent } from '../../../modales/editar-ejercico/editar-ejercico.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ExcerciseServiceService } from '../../../core/services/excercise-service.service';
import Swal, { SweetAlertResult } from 'sweetalert2';
import { Ejercicio } from '../../../shared/models/ejercicio';


@Component({
  selector: 'app-dashboard-exercises',
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './dashboard-exercises.component.html',
  styleUrl: './dashboard-exercises.component.css',
})
export class DashboardExercisesComponent implements OnInit {
  @Input() tipoUsuario!: string;
  datos: Ejercicio[] = [];
  ejercicios: Ejercicio[] = [...this.datos];
  terminoBusqueda: string = '';
  seleccionados: number[] = [];
  //paginacion
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  Math = Math;
  totalPaginas: number = 1;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: Router,
    private excerciseService: ExcerciseServiceService
  ) {}

  ngOnInit() {
    this.cargarEjercicios();
  }

  abrirModal(ejercicio: any): void {
    const dialogRef = this.dialog.open(EditarEjercicoComponent, {
      width: '600px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-panel',
      disableClose: false,
      autoFocus: true,
      data: { ...ejercicio },
    });

    const instance = dialogRef.componentInstance;
    instance.ejercicioActualizado.subscribe(() => {
      this.cargarEjercicios(); // Recarga los ejercicios después de editar
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.actualizado) {
        this.cargarEjercicios();
        this.mostrarMensaje('Ejercicio actualizado correctamente', 'success');
        return;
      }

      if (resultado && resultado.id) {
        const index = this.ejercicios.findIndex(
          (e) => e.idEjercicio === resultado.id
        );

        if (resultado.isEdit && index > -1) {
          this.ejercicios[index] = resultado;
          this.mostrarMensaje('Ejercicio actualizado correctamente', 'success');
        } else {
          this.ejercicios.push(resultado);
          this.mostrarMensaje('Ejercicio creado correctamente', 'success');
        }
      }
    });
  }

  crearEjercicio() {
    this.route.navigate(['/register-exercise']);
  }

  private mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' = 'success'
  ): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass:
        tipo === 'success' ? ['success-snackbar'] : ['error-snackbar'],
    });
  }

  cargarEjercicios(): void {
    this.excerciseService.getAllExcercises().subscribe({
      next: (ejercicio) => {
        this.datos = ejercicio;
        this.ejercicios = [...this.datos];
        this.totalPaginas = Math.ceil(
          this.ejercicios.length / this.elementosPorPagina
        );
      },
      error: (error) =>
        this.mostrarMensaje('Error al cargar ejercicios', error),
    });
  }

  quitarTildes(texto?: string): string {
    if (!texto) return '';
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  buscar() {
    const termino = this.quitarTildes(
      this.terminoBusqueda.trim().toLowerCase()
    );

    if (!termino) {
      this.ejercicios = [...this.datos];
      return;
    }

    this.ejercicios = this.datos.filter((item) => {
      const nombreNormalizado = this.quitarTildes(
        item.nombreEjercicio?.toLowerCase()
      );

      return nombreNormalizado.includes(termino);
    });
  }

  toggleSeleccion(id: number) {
    const index = this.seleccionados.indexOf(id);
    if (index > -1) {
      this.seleccionados.splice(index, 1);
    } else {
      this.seleccionados.push(id);
    }
  }

  eliminarEjercicio(id: number) {
    Swal.fire({
      title: '¿Eliminar ejercicio?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.excerciseService.deleteExercise(id).subscribe({
          next: () => {
            this.datos = this.datos.filter((d) => d.idEjercicio !== id);
            this.ejercicios = [...this.datos];
            this.seleccionados = this.seleccionados.filter((s) => s !== id);

            this.cargarEjercicios();

            Swal.fire({
              icon: 'success',
              title: 'Ejercicio eliminado',
              text: 'El ejercicio se eliminó correctamente.',
              timer: 2000,
              showConfirmButton: false,
            });
          },
          error: (error) => {
            console.error('Error al eliminar el ejercicio:', error);

            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el ejercicio. Intenta nuevamente.',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    });
  }

  // Ejercicios visibles en la página actual
  get ejerciciosPaginados() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.ejercicios.slice(inicio, fin);
  }

  // Cambiar de página
  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
  }
}
