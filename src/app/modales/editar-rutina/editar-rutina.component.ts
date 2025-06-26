import { Component, Inject, OnInit } from '@angular/core';
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

export interface RutinaData {
  nombre: string;
  descripcion: string;
  enfoque: string;
  imagen?: string;
  fotoRutina?: string;
  isEdit?: boolean;
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
})
export class EditarRutinaComponent implements OnInit {
  rutina: RutinaData 
  currentImageName = '';
  isUploading = false;

  constructor(
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditarRutinaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RutinaData
  ) {
    this.rutina = { ...data };
  }

  ngOnInit(){
    this.currentImageName = this.rutina.fotoRutina || 'imagen-rutina.jpg';
  }

  // Selección de archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Validaciones
    if (!this.validateFile(file)) {
      return;
    }

    this.processFile(file);
  }

  // Validar archivo
  private validateFile(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      this.showError('Tipo de archivo no válido. Solo se permiten JPG, PNG, GIF y WebP.');
      return false;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.showError('La imagen es demasiado grande. Tamaño máximo: 5MB.');
      return false;
    }

    return true;
  }

  // Procesar archivo
  private processFile(file: File) {
    this.isUploading = true;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        this.rutina.imagen = result;
        this.rutina.fotoRutina = file.name;
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
    this.rutina.imagen = undefined;
    this.rutina.fotoRutina = undefined;
    this.currentImageName = '';
    this.showSuccess('Imagen eliminada');
  }

  // Guardar cambios
  onSave() {
    if (this.isUploading) {
      this.showError('Espera a que termine la carga de la imagen');
      return;
    }

    // Validar descripción
    if (!this.rutina.descripcion || this.rutina.descripcion.trim() === '') {
      this.showError('La descripción es obligatoria');
      return;
    }

    const result: RutinaData = {
      nombre: this.rutina.nombre.trim(),
      enfoque: this.rutina.enfoque.trim(),
      descripcion: this.rutina.descripcion.trim(),
      imagen: this.rutina.imagen,
      fotoRutina: this.rutina.fotoRutina,
    };

    this.dialogRef.close(result);
  }

  // Cancelar
  onCancel() {
    this.dialogRef.close();
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
}
