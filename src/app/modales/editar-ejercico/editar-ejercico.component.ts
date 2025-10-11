import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcerciseServiceService } from '../../core/services/excercise-service.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Ejercicio } from '../../shared/models/ejercicio';


@Component({
  selector: 'app-editar-ejercico',
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
  templateUrl: './editar-ejercico.component.html',
  styleUrl: './editar-ejercico.component.css',
})
export class EditarEjercicoComponent implements OnInit {
  @Output() ejercicioActualizado = new EventEmitter<void>();
  ejercicio: Ejercicio;
  currentImageName: string = '';
  isUploading: boolean = false;
  archivoSeleccionado: File | null = null;

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditarEjercicoComponent>,
    private exerciseService: ExcerciseServiceService,
    @Inject(MAT_DIALOG_DATA) public data: Ejercicio
  ) {
    this.ejercicio = { ...data };
  }

  ngOnInit() {
    this.currentImageName = this.ejercicio.fotoEjercicio || 'imagen-rutina.jpg';
  }

  onSave() {
    const result: any = {
      idEjercicio: this.ejercicio.idEjercicio!,
      nombreEjercicio: (this.ejercicio.nombreEjercicio || '').trim(),
      descripcionEjercicio: (this.ejercicio.descripcionEjercicio || '').trim(),
      met: this.ejercicio.met,
      musculos: (this.ejercicio.musculos || '').trim(),
      isEdit: this.ejercicio.isEdit,
    };

    // Validación del tamaño de imagen
    if (this.archivoSeleccionado) {
      const maxSizeMB = 10;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (this.archivoSeleccionado.size > maxSizeBytes) {
        this.showError(
          `La imagen seleccionada supera los ${maxSizeMB}MB permitidos`
        );
        return;
      }
    }

    const formData = new FormData();

    formData.append(
      'datos',
      new Blob([JSON.stringify(result)], { type: 'application/json' })
    );

    if (this.archivoSeleccionado) {
      formData.append('fotoEjercicio', this.archivoSeleccionado);
    } else {
      formData.append('fotoEjercicio', new Blob(), '');
    }

    this.exerciseService
      .updateExercise(formData, this.ejercicio.idEjercicio!)
      .subscribe({
        next: (response) => {
          this.showSuccess('Ejercicio actualizado correctamente');
          this.ejercicioActualizado.emit();
          this.dialogRef.close({ actualizado: true });
        },
        error: (error) => {
          this.showError('Error al actualizar el ejercicio');
        },
        complete: () => {
          this.isUploading = false;
          this.archivoSeleccionado = null;
        },
      });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!this.validateFile(file)) {
      return;
    }
    this.archivoSeleccionado = file; // Guardar el archivo seleccionado
    this.processFile(file); 
  }

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

  private processFile(file: File) {
    this.isUploading = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        this.ejercicio.fotoEjercicio = result;
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

  removeImage() {
    this.ejercicio.fotoEjercicio = undefined;
    this.currentImageName = '';
    this.archivoSeleccionado = null;
    this.showSuccess('Imagen eliminada');
  }

  onCancel() {
    this.dialogRef.close();
  }
}
