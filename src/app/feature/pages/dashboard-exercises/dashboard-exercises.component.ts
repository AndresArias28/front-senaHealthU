import { Component, Input, OnInit } from '@angular/core';
import { RutineService } from '../../../core/services/rutine/rutine.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EditarEjercicoComponent } from '../../../modales/editar-ejercico/editar-ejercico.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ExcerciseServiceService } from '../../../core/services/excercise-service.service';

@Component({
  selector: 'app-dashboard-exercises',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-exercises.component.html',
  styleUrl: './dashboard-exercises.component.css',
})
export class DashboardExercisesComponent implements OnInit {
  @Input() tipoUsuario!: string;
  datos: any[] = [];
  ejercicios = [...this.datos];
  terminoBusqueda: string = '';
  seleccionados: number[] = [];

  constructor(
    private rutineService: RutineService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: Router,
    private excerciseService: ExcerciseServiceService
  ) {}

  ngOnInit() {
    this.rutineService.getAllExcercises().subscribe({
      next: (ejercicios) => {
        console.log('Ejercicios obtenidos:', ejercicios);
        this.datos = ejercicios;
        this.ejercicios = [...this.datos];
        this.rutineService.ejercicios.next(this.ejercicios); // Actualiza el observable de ejercicios
      },
      error: (error) => {
        console.error('Error al obtener ejercicios:', error);
      },
    });
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
      console.log('Resultado del modal:', resultado);
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

  cargarEjercicios() {
    this.rutineService.getAllExcercises().subscribe({
      next: (ejercicio) => {
        console.log('ejercicios recargadas desde el servidor:', ejercicio);
        this.ejercicios = ejercicio;
      },
      error: (error) => {
        console.error('Error al cargar rutinas:', error);
      },
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

    if (!confirm('¿Estas seguro de que deseas eliminar este ejercicio?')) {
      return;
    }

    this.excerciseService.deleteExercise(id).subscribe({
      next: () => {
        this.datos = this.datos.filter((d) => d.idEjercicio !== id);
        this.ejercicios = [...this.datos]; // Actualiza los ejercicios filtrados
        this.seleccionados = this.seleccionados.filter(
          (s) => s !== id
        );
        this.mostrarMensaje('Ejercicio eliminado correctamente', 'success');
        this.cargarEjercicios(); // Recarga los ejercicios después de eliminar
      },
      error: (error) => {
        console.error('Error al eliminar el ejercicio:', error);
        this.mostrarMensaje('Error al eliminar el ejercicio', 'error');
      },
    });
  }
}
