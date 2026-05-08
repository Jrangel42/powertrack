export type EstadoAula = 'Normal' | 'Advertencia' | 'Crítico';

export interface Aula {
  id: string;
  nombre: string;
  horarioInicio: number; // 0-23
  horarioCierre: number; // 0-23
  consumoEsperado: number; // kWh
  consumoActual: number; // kWh
  eficiencia: number; // porcentaje
  estado: EstadoAula;
  historialConsumo: HistorialEntry[];
  ultimaActualizacion: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HistorialEntry {
  valor: number;
  eficiencia: number;
  timestamp: Date;
  esAnomalia: boolean;
}
