import { Injectable } from '@nestjs/common';
import { Aula } from '../../common/interfaces/aula.interface';
import {
  UMBRAL_CONSUMO_ELEVADO,
  UMBRAL_EFICIENCIA_BAJA,
  UMBRAL_CONSUMO_FUERA_HORARIO,
} from '../../common/constants/app.constants';

export interface Anomalia {
  tipo: 'ConsumoElevado' | 'EficienciaBaja' | 'ConsumoFueraHorario';
  valor: number;
}

@Injectable()
export class DetectorAnomaliasService {
  detectarConsumoElevado(consumoActual: number, promedio: number): boolean {
    if (promedio <= 0) return false;
    return consumoActual > promedio * UMBRAL_CONSUMO_ELEVADO;
  }

  detectarEficienciaBaja(eficiencia: number): boolean {
    return eficiencia < UMBRAL_EFICIENCIA_BAJA;
  }

  detectarConsumoFueraHorario(
    aula: Aula,
    consumoActual: number,
    horaActual: number,
    esDiaLaboral: boolean,
  ): boolean {
    const fueraDeHorario =
      !esDiaLaboral ||
      horaActual < aula.horarioInicio ||
      horaActual >= aula.horarioCierre;

    if (!fueraDeHorario) return false;
    return consumoActual > aula.consumoEsperado * UMBRAL_CONSUMO_FUERA_HORARIO;
  }

  detectarAnomalias(
    aula: Aula,
    promedio: number,
    horaActual: number,
    esDiaLaboral: boolean,
  ): Anomalia[] {
    const anomalias: Anomalia[] = [];

    if (this.detectarConsumoElevado(aula.consumoActual, promedio)) {
      anomalias.push({ tipo: 'ConsumoElevado', valor: aula.consumoActual });
    }

    if (this.detectarEficienciaBaja(aula.eficiencia)) {
      anomalias.push({ tipo: 'EficienciaBaja', valor: aula.eficiencia });
    }

    if (
      this.detectarConsumoFueraHorario(
        aula,
        aula.consumoActual,
        horaActual,
        esDiaLaboral,
      )
    ) {
      anomalias.push({
        tipo: 'ConsumoFueraHorario',
        valor: aula.consumoActual,
      });
    }

    return anomalias;
  }
}
