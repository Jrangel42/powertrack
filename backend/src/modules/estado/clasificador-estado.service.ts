import { Injectable } from '@nestjs/common';
import { EstadoAula } from '../../common/interfaces/aula.interface';
import {
  UMBRAL_NORMAL,
  UMBRAL_ADVERTENCIA,
  COLOR_NORMAL,
  COLOR_ADVERTENCIA,
  COLOR_CRITICO,
} from '../../common/constants/app.constants';

@Injectable()
export class ClasificadorEstadoService {
  clasificarEstado(eficiencia: number): EstadoAula {
    if (eficiencia >= UMBRAL_NORMAL) return 'Normal';
    if (eficiencia >= UMBRAL_ADVERTENCIA) return 'Advertencia';
    return 'Crítico';
  }

  obtenerColor(estado: EstadoAula): string {
    switch (estado) {
      case 'Normal':
        return COLOR_NORMAL;
      case 'Advertencia':
        return COLOR_ADVERTENCIA;
      case 'Crítico':
        return COLOR_CRITICO;
    }
  }
}
