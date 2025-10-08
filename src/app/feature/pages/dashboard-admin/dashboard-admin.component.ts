import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { Aprendiz } from '../../../shared/models/aprendiz';
import { environment } from '../../../../environments/environmets.mapbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  @Input() tipoUsuario: string = '';
  // --- Métricas Rápidas ---
  totalAprendicesActivos = 0;
  promedioHorasEntrenadas = 0;
  rutinasCompletadasHoy = 15; // Dato estático de ejemplo
  rutinasAsignadas = 50; // Dato estático de ejemplo

  // --- Datos para Gráficas ---
  chartDataHoras: { label: string, value: number }[] = [];
  chartDataRutinas: { label: string, value: number }[] = [];

  // --- Tabla de Aprendices ---
  aprendices: Aprendiz[] = [];
  aprendicesFiltrados: Aprendiz[] = [];
  filtroNombre = '';
  filtroFicha = '';
  filtroNivel = '';


  // --- Ranking TOP 3 ---
  topAprendices: any[] = [];

  // dataSource = new MatTableDataSource(this.aprendices);

  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor( private userService: UserService ) { }

  ngOnInit(): void {
    this.userService.getAprendicesDashboard().subscribe({
      next: (response) => {
        console.log('Datos de aprendices obtenidos del servicio:', response.data);
        this.aprendices = response.data;
        this.aprendicesFiltrados = response.data;
        this.calcularMetricas();
        this.prepararDatosGraficas();
        this.calcularTopAprendices();
      },
      error: (error) => {
        console.error('Error al obtener los datos de aprendices:', error);
      }
    });
  }

  calcularMetricas(): void { 
    this.totalAprendicesActivos = this.aprendices.length;
    const totalHoras = this.aprendices.reduce((sum, ap) => sum + ap.horas, 0);
    this.promedioHorasEntrenadas = Math.round(totalHoras / this.totalAprendicesActivos);
  }

  prepararDatosGraficas(): void {
    this.chartDataHoras = this.aprendices.map(ap => ({
      label: ap.nombre,
      value: ap.horas
    }));

    this.chartDataRutinas = [
      { label: 'Completadas', value: this.rutinasCompletadasHoy },
      { label: 'Pendientes', value: this.rutinasAsignadas - this.rutinasCompletadasHoy }
    ];
  }

  calcularTopAprendices(): void {
    this.topAprendices = [...this.aprendices]
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 3);
  }

  aplicarFiltros(): void {
    this.aprendicesFiltrados = this.aprendices.filter(ap => {
      const nombreMatch = ap.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const fichaMatch = ap.ficha.toString().includes(this.filtroFicha);
      const nivelMatch = this.filtroNivel === '' || ap.nivel === this.filtroNivel;
      return nombreMatch && fichaMatch && nivelMatch;
    });
  }
}
