import { Injectable } from '@nestjs/common';
import { Estadisticas } from '../../common/interfaces/estadisticas.interface';
import { HistorialEntry } from '../../common/interfaces/aula.interface';

@Injectable()
export class EficienciaService {
  /**
   * Calcula la eficiencia energética: η = (E_útil / E_total) × 100
   * E_útil = consumoEsperado, E_total = consumoActual
   */
  calcularEficiencia(consumoActual: number, consumoEsperado: number): number {
    if (consumoActual <= 0) return 0;
    const eficiencia = (consumoEsperado / consumoActual) * 100;
    return Math.round(eficiencia * 100) / 100;
  }

  calcularPromedio(valores: number[]): number {
    if (valores.length === 0) return 0;
    const suma = valores.reduce((acc, v) => acc + v, 0);
    return Math.round((suma / valores.length) * 100) / 100;
  }

  calcularDesviacion(valores: number[]): number {
    if (valores.length === 0) return 0;
    const promedio = this.calcularPromedio(valores);
    const varianza =
      valores.reduce((acc, v) => acc + Math.pow(v - promedio, 2), 0) /
      valores.length;
    return Math.round(Math.sqrt(varianza) * 100) / 100;
  }

  calcularMinMax(valores: number[]): { min: number; max: number } {
    if (valores.length === 0) return { min: 0, max: 0 };
    return {
      min: Math.round(Math.min(...valores) * 100) / 100,
      max: Math.round(Math.max(...valores) * 100) / 100,
    };
  }

  calcularEstadisticas(historial: HistorialEntry[]): Estadisticas {
    if (historial.length === 0) {
      return {
        consumoMinimo: 0,
        consumoMaximo: 0,
        consumoPromedio: 0,
        desviacionEstandar: 0,
        eficienciaPromedio: 0,
      };
    }

    const consumos = historial.map((h) => h.valor);
    const eficiencias = historial.map((h) => h.eficiencia);
    const { min, max } = this.calcularMinMax(consumos);

    return {
      consumoMinimo: min,
      consumoMaximo: max,
      consumoPromedio: this.calcularPromedio(consumos),
      desviacionEstandar: this.calcularDesviacion(consumos),
      eficienciaPromedio: this.calcularPromedio(eficiencias),
    };
  }
}
