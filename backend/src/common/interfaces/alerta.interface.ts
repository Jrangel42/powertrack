export type TipoAlerta =
  | 'Consumo Elevado'
  | 'Eficiencia Baja'
  | 'Consumo Fuera de Horario';

export type SeveridadAlerta = 'Baja' | 'Media' | 'Alta';

export interface Alerta {
  id: string;
  aulaId: string;
  aulaNombre: string;
  tipo: TipoAlerta;
  severidad: SeveridadAlerta;
  descripcion: string;
  timestamp: Date;
  resuelta: boolean;
  resolutionTime?: Date;
  resolutionNotes?: string;
}
