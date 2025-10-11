import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LoginService } from '../../../core/services/login/login.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RutineService } from '../../../core/services/rutine/rutine.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditarRutinaComponent } from '../../../modales/editar-rutina/editar-rutina.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-dashboard-graphics',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './dashboard-graphics.component.html',
  styleUrl: './dashboard-graphics.component.css',
})
export class DashboardGraphicsComponent implements OnInit, OnChanges {
  @Output() rutinaEliminada = new EventEmitter<void>();
  @Input() tipoUsuario!: string;
  userLoginOn: boolean = false;
  terminoBusqueda: string = '';
  datos: any[] = [];
  seleccionados: number[] = [];
  datosFiltrados = [...this.datos];
  //paginacion
  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  Math = Math;

  constructor(
    private loginService: LoginService,
    private rutineService: RutineService,
    private dialog: MatDialog,
    private route: Router,
    private snackBar: MatSnackBar
  ) {}

  abrirModal(rutina: any): void {
    const dialogRef = this.dialog.open(EditarRutinaComponent, {
      width: '510px',
      maxWidth: '100%',
      height: '70vh',
      maxHeight: '100vh',
      panelClass: 'custom-modal-panel',
      disableClose: false,
      autoFocus: true,
      data: { ...rutina },
    });

    const instance = dialogRef.componentInstance;

    instance.rutinaActualizada.subscribe(() => {
      this.cargarRutinas();
    });

    dialogRef.afterClosed().subscribe((resultado) => {
      if (resultado?.actualizado) {
        this.cargarRutinas();
        this.mostrarMensaje('Rutinas actualizadas correctamente', 'success');
        return;
      }

      if (resultado && resultado.id) {
        const index = this.datosFiltrados.findIndex(
          (r) => r.id === resultado.id
        );
        if (resultado.isEdit && index > -1) {
          this.datosFiltrados[index] = resultado;
          this.mostrarMensaje('Rutina actualizada correctamente', 'success');
        } else {
          this.datosFiltrados.push(resultado);
          this.mostrarMensaje('Rutina creada correctamente', 'success');
        }
      }
    });
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

  ngOnInit(): void {
    this.loginService.currentUserLoginOn.subscribe({
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn;
      },
    });

    this.rutineService.getAllRutines().subscribe({
      next: (response) => {
        this.datos = response;
        this.datosFiltrados = [...this.datos];
        this.rutineService.rutines.next(this.datos);
      },
      error: (error) => {
        console.error('Error al obtener rutinas:', error);
      },
    });
  }

  asignarRutina(idRutina: any) {
    this.route.navigate(['/asignar-rutina', idRutina]);
  }

  cargarRutinas() {
    this.rutineService.getAllRutines().subscribe({
      next: (rutinas) => {
        this.datosFiltrados = rutinas;
      },
      error: (error) => {
        console.error('Error al cargar rutinas:', error);
      },
    });
  }

  redirigeRutinas() {
    this.route.navigateByUrl('/register-rutine');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tipoUsuario'] && this.tipoUsuario) {
      this.datosFiltrados = this.datos.filter((item) =>
        item.tipoUsuario.includes(this.tipoUsuario)
      );
    }
  }

  toggleSeleccion(id: number) {
    const index = this.seleccionados.indexOf(id);
    if (index > -1) {
      this.seleccionados.splice(index, 1);
    } else {
      this.seleccionados.push(id);
    }
  }

  eliminarRutina(id: number) {
    Swal.fire({
      title: '¿Eliminar rutina?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result: SweetAlertResult) => {
      if (result.isConfirmed) {
        this.rutineService.deleteRutine(id).subscribe({
          next: () => {
            // Actualizar arrays en memoria
            this.datos = this.datos.filter((d) => d.id !== id);
            this.datosFiltrados = [...this.datos];
            this.seleccionados = this.seleccionados.filter((s) => s !== id);

            // Mensaje de éxito
            Swal.fire({
              title: 'Eliminada',
              text: 'La rutina fue eliminada correctamente.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            });
            this.cargarRutinas();
          },
          error: (error) => {
            console.error('Error al eliminar la rutina:', error);

            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la rutina. Inténtalo de nuevo.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
            });
          },
        });
      }
    });
  }

  eliminarSeleccionados() {
    if (this.seleccionados.length === 0) {
      alert('No hay rutinas seleccionadas para eliminar.');
      return;
    }
    if (
      !confirm(
        '¿Estás seguro de que deseas eliminar las rutinas seleccionadas?'
      )
    ) {
      return;
    }

    this.datos = this.datos.filter((d) => !this.seleccionados.includes(d.id));
    this.seleccionados = [];
  }

  get totalPaginas(): number {
    return Math.ceil(this.datosFiltrados.length / this.elementosPorPagina);
  }

  // Rutinas visibles en la página actual
  get rutinasPaginadas() {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.datosFiltrados.slice(inicio, fin);
  }

  // Cambiar de página
  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  buscar() {
    const termino = this.quitarTildes(
      this.terminoBusqueda.trim().toLowerCase()
    );

    if (!termino) {
      this.datosFiltrados = [...this.datos];
      return;
    }

    this.datosFiltrados = this.datos.filter((item) => {
      const nombreNormalizado = this.quitarTildes(item.nombre?.toLowerCase());

      return nombreNormalizado.includes(termino);
    });
  }
}
