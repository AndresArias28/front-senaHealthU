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
import { UserService } from '../../../core/services/user/user.service';
import { RutineService } from '../../../core/services/rutine/rutine.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditarRutinaComponent } from '../../../modales/editar-rutina/editar-rutina.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComunicacionService } from '../../../core/services/comunicacion/comunicacion.service';

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
  ],
  templateUrl: './dashboard-graphics.component.html',
  styleUrl: './dashboard-graphics.component.css',
})
export class DashboardGraphicsComponent implements OnInit, OnChanges {
  @Output() rutinaEliminada = new EventEmitter<void>();
  @Input() tipoUsuario!: string;
  userLoginOn: boolean = false;
  terminoBusqueda: string = '';
  datos: any[] = []; // Cambia el tipo de datos según tu necesidad
  seleccionados: number[] = []; // Lista de IDs de rutinas seleccionadas
  datosFiltrados = [...this.datos]; // copia inicial de datos para filtrar

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private rutineService: RutineService,
    private dialog: MatDialog,
    private route: Router,
    private snackBar: MatSnackBar,
    private comunicacionService: ComunicacionService // Asegúrate de importar el servicio de comunicación
  ) {}
  abrirModal(rutina: any): void {
    const dialogRef = this.dialog.open(EditarRutinaComponent, {
      width: '650px',
      maxWidth: '95vw',
      maxHeight: '90vh',
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
      console.log('Resultado del modal:', resultado);
      if (resultado?.actualizado) {
        this.cargarRutinas();
        this.mostrarMensaje('Rutinas actualizadas correctamente', 'success');
        return;
      }

      // Si se devolvió un nuevo objeto rutina (caso de creación o edición)
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
    // se ejecuta una sola vez al cargar el componente en el DOM del navegador

    this.loginService.currentUserLoginOn.subscribe({
      //se suscribe al observable currentUserLoginOn al iniciar el componente
      next: (userLoginOn) => {
        this.userLoginOn = userLoginOn; //almacena el estado del login en la variable userLoggedIn
      },
    });

    this.rutineService.getAllRutines().subscribe({
      next: (response) => {
        console.log('Rutinas obtenidas:', response);
        this.datos = response; // Asigna las rutinas obtenidas a la variable datos
        this.datosFiltrados = [...this.datos]; // Actualiza los datos filtrados
        this.rutineService.rutines.next(this.datos); // Actualiza el observable de rutinas
      },
      error: (error) => {
        console.error('Error al obtener rutinas:', error);
      },
    });
  }

  cargarRutinas() {
    this.rutineService.getAllRutines().subscribe({
      next: (rutinas) => {
        console.log('Rutinas recargadas desde el servidor:', rutinas); // 👈 pon esto
        this.datosFiltrados = rutinas;
      },
      error: (error) => {
        console.error('Error al cargar rutinas:', error);
      },
    });
  }

  editarRutina(id: number) {
    this.route.navigate(['/edit-rutine', id]);
  }

  redirigeRutinas() {
    this.route.navigateByUrl('/register-rutine'); // Redirige a la página de registro de rutinas
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tipoUsuario'] && this.tipoUsuario) {
      console.log('Tipo de usuario actualizado:', this.tipoUsuario);
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
    if (!confirm('¿Estás seguro de que deseas eliminar esta rutina?')) {
      return; // Cancela la eliminación si el usuario no confirma
    }

    this.rutineService.deleteRutine(id).subscribe({
      next: () => {
        // console.log('Rutina eliminada:', response);
        this.datos = this.datos.filter((d) => d.id !== id);
        this.datosFiltrados = [...this.datos]; // Actualiza los datos filtrados
        this.seleccionados = this.seleccionados.filter((s) => s !== id); // Elimina el ID de la lista de seleccionados
        this.rutinaEliminada.emit();
        alert('Rutina eliminada exitosamente.');
        //recargar la apogina
        window.location.reload();
      },
      error: (error) => {
        console.error('Error al eliminar la rutina:', error);
      },
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
      return; // Cancela la eliminación si el usuario no confirma
    }

    this.datos = this.datos.filter((d) => !this.seleccionados.includes(d.id));
    this.seleccionados = [];
  }

  quitarTildes(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  buscar() {
    const termino = this.quitarTildes(
      this.terminoBusqueda.trim().toLowerCase()
    ); // Quita tildes y convierte a minúsculas this.terminoBusqueda.trim().toLowerCase();

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
