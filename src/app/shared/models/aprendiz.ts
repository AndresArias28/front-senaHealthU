export interface Aprendiz {
  nombre: string;
  ficha: number;
  nivel: string;
  puntos: number;
  horas: number;
}

export interface AprendizDashboardResponse {
  status: string;
  message: string;
  data: Aprendiz[];
}
