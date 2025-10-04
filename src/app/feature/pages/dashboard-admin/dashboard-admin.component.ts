import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Datos de ejemplo para los aprendices
const APRENDICES_DATA = [
  { id: 1, nombre: 'Ana García', ficha: '2558300', nivel: 'Alto', puntos: 480, horas: 95 },
  { id: 2, nombre: 'Luis Hernandez', ficha: '2558300', nivel: 'Medio', puntos: 320, horas: 60 },
  { id: 3, nombre: 'Carlos Martinez', ficha: '2558301', nivel: 'Bajo', puntos: 150, horas: 30 },
  { id: 4, nombre: 'Sofia Rodriguez', ficha: '2558301', nivel: 'Alto', puntos: 500, horas: 102 },
  { id: 5, nombre: 'Maria Lopez', ficha: '2558302', nivel: 'Medio', puntos: 280, horas: 55 },
  { id: 6, nombre: 'Javier Torres', ficha: '2558302', nivel: 'Alto', puntos: 490, horas: 98 },
  { id: 7, nombre: 'Laura Ramirez', ficha: '2558300', nivel: 'Bajo', puntos: 180, horas: 40 },
  { id: 8, nombre: 'Pedro Sanchez', ficha: '2558301', nivel: 'Medio', puntos: 350, horas: 70 },
];

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
  aprendices = [...APRENDICES_DATA];
  aprendicesFiltrados = [...APRENDICES_DATA];
  filtroNombre = '';
  filtroFicha = '';
  filtroNivel = '';

  // --- Ranking TOP 3 ---
  topAprendices: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.calcularMetricas();
    this.prepararDatosGraficas();
    this.calcularTopAprendices();
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
      const fichaMatch = ap.ficha.includes(this.filtroFicha);
      const nivelMatch = this.filtroNivel === '' || ap.nivel === this.filtroNivel;
      return nombreMatch && fichaMatch && nivelMatch;
    });
  }
}
