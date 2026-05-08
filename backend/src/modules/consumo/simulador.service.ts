import { Injectable } from '@nestjs/common';
import { Aula } from '../../common/interfaces/aula.interface';
import {
  VARIABILIDAD_PORCENTAJE,
  PROBABILIDAD_PICO,
  FACTOR_PICO,
  CONSUMO_FUERA_HORARIO_MAX,
} from '../../common/constants/app.constants';

@Injectable()
export class SimuladorService {
  /**
   * Verifica si la hora actual está dentro del horario operativo del aula
   * y si es un día laboral (lunes-viernes)
   */
  estaEnHorarioOperativo(
    aula: Aula,
    horaActual: number,
    esDiaLaboral: boolean,
  ): boolean {
    if (!esDiaLaboral) return false;
    return horaActual >= aula.horarioInicio && horaActual < aula.horarioCierre;
  }

  /**
   * Aplica variabilidad aleatoria ±15% al consumo base
   */
  aplicarVariabilidad(consumo: number): number {
    const factor =
      1 - VARIABILIDAD_PORCENTAJE + Math.random() * 2 * VARIABILIDAD_PORCENTAJE;
    return consumo * factor;
  }

  /**
   * Determina si se debe generar un pico de consumo (5% de probabilidad)
   */
  generarPico(): boolean {
    return Math.random() < PROBABILIDAD_PICO;
  }

  /**
   * Genera el valor de consumo para un aula dado el contexto temporal
   */
  generarConsumo(
    aula: Aula,
    horaActual: number,
    esDiaLaboral: boolean,
  ): number {
    if (this.estaEnHorarioOperativo(aula, horaActual, esDiaLaboral)) {
      let consumo = this.aplicarVariabilidad(aula.consumoEsperado);

      if (this.generarPico()) {
        consumo = consumo * FACTOR_PICO;
      }

      return Math.round(consumo * 100) / 100;
    } else {
      // Fuera de horario: 0-5% del consumo esperado
      const consumoFueraHorario =
        aula.consumoEsperado * Math.random() * CONSUMO_FUERA_HORARIO_MAX;
      return Math.round(consumoFueraHorario * 100) / 100;
    }
  }

  /**
   * Obtiene la hora actual del sistema
   */
  getHoraActual(): number {
    return new Date().getHours();
  }

  /**
   * Verifica si el día actual es laboral (lunes=1 a viernes=5)
   */
  esDiaLaboral(): boolean {
    const dia = new Date().getDay();
    return dia >= 1 && dia <= 5;
  }
}
