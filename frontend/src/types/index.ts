export interface Aula {
  id: string;
  nombre: string;
  horarioInicio: number;
  horarioCierre: number;
  consumoEsperado: number;
  consumoActual: number;
  eficiencia: number;
  estado: 'Normal' | 'Advertencia' | 'Crítico';
  historialConsumo: HistorialEntry[];
  ultimaActualizacion: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface HistorialEntry {
  valor: number;
  eficiencia: number;
  timestamp: Date;
  esAnomalia?: boolean;
}

export interface Alerta {
  id: string;
  tipo: 'Consumo Elevado' | 'Eficiencia Baja' | 'Consumo Fuera de Horario';
  aulaId: string;
  aulaNombre: string;
  descripcion: string;
  severidad: 'Baja' | 'Media' | 'Alta';
  timestamp: Date;
  resuelta: boolean;
  resolutionTime?: Date;
  resolutionNotes?: string;
}

export interface Estadisticas {
  consumoMinimo: number;
  consumoMaximo: number;
  consumoPromedio: number;
  desviacionEstandar: number;
  eficienciaPromedio: number;
}

export interface CreateAulaDto {
  nombre: string;
  horarioInicio: number;
  horarioCierre: number;
  consumoEsperado: number;
}

export interface UpdateAulaDto {
  nombre?: string;
  horarioInicio?: number;
  horarioCierre?: number;
  consumoEsperado?: number;
}

export interface UIState {
  aulaSeleccionada: string | null;
  modalAbierto: 'crearAula' | 'editarAula' | 'confirmarEliminar' | null;
  loading: boolean;
  error: string | null;
  success: string | null;
}