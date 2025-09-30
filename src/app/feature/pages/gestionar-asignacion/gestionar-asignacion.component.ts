import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RutineService } from '../../../core/services/rutine/rutine.service';

interface Asignacion {
  id: number;
  nombreAprendiz: string;
  ficha: string;
  fechaCreacion: Date;
  nivelFisico: string;
}

@Component({
  selector: 'app-gestionar-asignacion',
  imports: [CommonModule],
  templateUrl: './gestionar-asignacion.component.html',
  styleUrl: './gestionar-asignacion.component.css',
})
export class GestionarAsignacionComponent {

  editarAsignacion(_t13: Asignacion) {
    throw new Error('Method not implemented.');
  }
  
  asignaciones: Asignacion[] = [];

  constructor(private rutineService: RutineService) {}

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

  verAsignacion() {
    // Lógica para ver la asignación
    console.log('Ver asignación');
  }
}
