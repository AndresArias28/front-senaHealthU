// rutina.model.ts
export interface Rutina {
  idRutina: number;
  nombre: string;
}

export interface Asignacion {
  idAsignacion: number;
  idPersona: number;
  idRutina: number;
  diasAsignado: string;    
  observaciones?: string | null;
  fechaAsignacion?: string;
  fechaFinalizacion?: string | null;
}

export interface AsignacionRutinaDTO {
  idPersona: number;
  idRutina: number;
  observaciones?: string | null;
  diasAsignado?: string;
  fechaFinalizacion?: string | null;
}
