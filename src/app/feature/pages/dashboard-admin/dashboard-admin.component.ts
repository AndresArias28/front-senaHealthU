import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user/user.service';
import { Aprendiz } from '../../../shared/models/aprendiz';
import { BaseChartDirective } from 'ng2-charts';

import {
  Chart,
  registerables,
  ChartConfiguration,
  ChartData,
  ChartType,
} from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css'],
})
export class DashboardAdminComponent implements OnInit, AfterViewInit {
  @Input() tipoUsuario: string = '';
  @ViewChildren(BaseChartDirective) charts!: QueryList<BaseChartDirective>;
  // --- Métricas Rápidas ---
  totalAprendicesActivos = 0;
  promedioHorasEntrenadas = 0;
  rutinasCompletadasHoy = 15; // Dato estático de ejemplo
  rutinasAsignadas = 50; // Dato estático de ejemplo
  Math = Math;
  page = 1;
  pageSize = 10;

  // --- Datos para Gráficas ---
  chartDataHoras: { label: string; value: number }[] = [];
  chartDataRutinas: { label: string; value: number }[] = [];

  // --- Configuración de Gráfica de Barras ---
  barChartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,
    animation: false,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {},
      y: { beginAtZero: true },
    },
  };
  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { data: [], label: 'Horas Acumuladas', backgroundColor: '#007bff' },
    ],
  };

  // --- grafica de Pastel ---
  pieChartOptions: ChartConfiguration['options'] = {
    maintainAspectRatio: false,
    animation: false,
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };
  pieChartType: ChartType = 'pie';
  pieChartData: ChartData<'pie'> = {
    labels: ['Completadas', 'Pendientes'],
    datasets: [{ data: [], backgroundColor: ['#28a745', '#ffc107'] }],
  };

  // --- Tabla de Aprendices ---
  aprendices: Aprendiz[] = [];
  aprendicesFiltrados: Aprendiz[] = [];
  filtroNombre = '';
  filtroFicha = '';
  filtroNivel = '';

  // --- Ranking TOP 3 ---
  topAprendices: any[] = [];
  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userService.getAprendicesDashboard().subscribe({
      next: (response) => {
        this.aprendices = response.data;
        this.aprendicesFiltrados = response.data;
        this.calcularMetricas();
        this.prepararDatosGraficas();
        this.calcularTopAprendices();

        this.cdr.detectChanges(); 

        setTimeout(() => this.refreshCharts(), 300);
      },
      error: (error) => {
        console.error('Error al obtener los datos de aprendices:', error);
      },
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.refreshCharts(), 400);
  }

  get aprendicesPaginados(): Aprendiz[] {
    const start = (this.page - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.aprendicesFiltrados.slice(start, end);
  }

  private refreshCharts(): void {
    if (this.charts && this.charts.length > 0) {
      this.charts.forEach((chartDir) => {
        if (chartDir.chart) {
          chartDir.chart.update();
        }
      });
    }
  }

  calcularMetricas(): void {
    this.totalAprendicesActivos = this.aprendices.length;
    const totalHoras = this.aprendices.reduce((sum, ap) => sum + ap.horas, 0);
    this.promedioHorasEntrenadas = Math.round(
      totalHoras / this.totalAprendicesActivos
    );
  }

  prepararDatosGraficas(): void {
    const top10 = [...this.aprendices]
      .sort((a, b) => b.horas - a.horas)
      .slice(0, 15);
    // --- Actualizar gráfica de barras ---
    this.barChartData.labels = top10.map((ap) => ap.nombre);
    this.barChartData.datasets[0].data = top10.map((ap) => ap.horas);

    // --- Actualizar gráfica de pastel ---
    this.pieChartData.datasets[0].data = [
      this.rutinasCompletadasHoy,
      this.rutinasAsignadas - this.rutinasCompletadasHoy,
    ];
  }

  calcularTopAprendices(): void {
    this.topAprendices = [...this.aprendices]
      .sort((a, b) => b.puntos - a.puntos)
      .slice(0, 3);
  }

  aplicarFiltros(): void {
    this.aprendicesFiltrados = this.aprendices.filter((ap) => {
      const nombreMatch = ap.nombre
        .toLowerCase()
        .includes(this.filtroNombre.toLowerCase());
      const fichaMatch = ap.ficha.toString().includes(this.filtroFicha);
      const nivelMatch =
        this.filtroNivel === '' || ap.nivel === this.filtroNivel;
      return nombreMatch && fichaMatch && nivelMatch;
    });
  }
}
