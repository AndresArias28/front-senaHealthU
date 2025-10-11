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
import { RutineService } from '../../core/services/rutine/rutine.service';

export interface RutinaData {
  idRutina?: number;
  nombre: string;
  descripcion: string;
  enfoque: string;
  fotoRutina?: string;
  isEdit?: boolean;
  dificultad: string;
  ejercicios?: {
    idEjercicio?: number;
    nombre: string;
    repeticion: string;
    series: string;
    carga: string;
    duracion: string;
    descripcion: string;
  }[];
}

@Component({
  selector: 'app-editar-rutina',
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
    MatIcon,
    MatChipsModule,
  ],
  templateUrl: './editar-rutina.component.html',
  styleUrls: ['./editar-rutina.component.css'],
})
export class EditarRutinaComponent implements OnInit {
  @Output() rutinaActualizada = new EventEmitter<void>();

  rutina: RutinaData = {
    nombre: '',
    descripcion: '',
    enfoque: '',
    ejercicios: [],
    dificultad: '',
  };

  currentImageName = '';
  isUploading = false;
  archivoSeleccionado: File | null = null;
  listaEjerciciosDisponibles: any[] = [];

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditarRutinaComponent>,
    private rutineService: RutineService,
    @Inject(MAT_DIALOG_DATA) public data: RutinaData // esto es para recibir los datos al abrir el modal
  ) {
    this.rutina = { ...data };
  }

  ngOnInit() {
    this.currentImageName = this.rutina.fotoRutina || 'imagen-rutina.jpg';
  }

  cargarEjerciciosDisponibles(): void {
    if (this.listaEjerciciosDisponibles.length === 0) {
      this.rutineService.getAllExcercises().subscribe({
        next: (res) => {
          this.listaEjerciciosDisponibles = res;
        },
        error: (err) => {
          this.showError('Error al cargar los ejercicios disponibles');
        },
      });
    }
  }

  // Guardar cambios
  onSave() {
    const result: any = {
      idRutina: this.data.idRutina!,
      nombre: (this.rutina.nombre || '').trim(),
      enfoque: (this.rutina.enfoque || '').trim(),
      descripcion: (this.rutina.descripcion || '').trim(),
      dificultad: (this.rutina.dificultad || '').trim(),
      isEdit: this.rutina.isEdit,
      ejercicios:
        this.rutina.ejercicios?.map((ejercicio: any) => ({
          idEjercicio: ejercicio.idEjercicio,
          series: Number(ejercicio.series),
          repeticion: Number(ejercicio.repeticion),
          carga: Number(ejercicio.carga),
          duracion: Number(ejercicio.duracion),
          descripcion: (ejercicio.descripcion || '').trim(),
        })) || [],
    };

    const formData = new FormData();

    formData.append(
      'datos',
      new Blob([JSON.stringify(result)], { type: 'application/json' })
    );

    if (this.archivoSeleccionado) {
      formData.append('fotoRutina', this.archivoSeleccionado);
    } else {
      formData.append('fotoRutina', new Blob(), '');
    }

    this.rutineService.updateRutine(formData, this.data.idRutina!).subscribe({
      next: (response) => {
        this.showSuccess('Rutina actualizada correctamente');
        this.rutinaActualizada.emit();
        this.dialogRef.close({ actualizado: true }); // Cerrar el modal y pasar la respuesta
      },
      error: (error) => {
        this.showError('No es posible editar la rutina, porque ya fue registrada');
      },
      complete: () => {
        this.isUploading = false;
        this.archivoSeleccionado = null;
      },
    });
  }

  // Validar archivo
  private validateFile(file: File): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      this.showError(
        'Tipo de archivo no válido. Solo se permiten JPG, PNG, GIF y WebP.'
      );
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.showError('La imagen es demasiado grande. Tamaño máximo: 5MB.');
      return false;
    }

    return true;
  }

  // Mostrar mensaje de éxito
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  // Mostrar mensaje de error
  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  // Procesar archivo
  private processFile(file: File) {
    this.isUploading = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        this.rutina.fotoRutina = result;
        this.currentImageName = file.name;
        this.showSuccess('Imagen cargada correctamente');
      } catch (error) {
        this.showError('Error al procesar la imagen');
      } finally {
        this.isUploading = false;
      }
    };

    reader.onerror = () => {
      this.showError('Error al leer el archivo');
      this.isUploading = false;
    };

    // Convertir a base64
    reader.readAsDataURL(file);
  }

  // Eliminar imagen
  removeImage() {
    this.rutina.fotoRutina = undefined;
    this.currentImageName = '';
    this.archivoSeleccionado = null;
    this.showSuccess('Imagen eliminada');
  }
  
  eliminarEjercicio(index: number): void {
    const confirmado = window.confirm(
      '¿Estás seguro de que deseas eliminar este ejercicio de la rutina?'
    );
    if (confirmado) {
      this.rutina.ejercicios?.splice(index, 1);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  tieneEjercicios(): boolean {
    return !!this.rutina?.ejercicios && this.rutina.ejercicios.length > 0;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validaciones
    if (!this.validateFile(file)) {
      return;
    }
    this.archivoSeleccionado = file; // Guardar el archivo seleccionado
    this.processFile(file); //previsualizar la imagen
  }
}
