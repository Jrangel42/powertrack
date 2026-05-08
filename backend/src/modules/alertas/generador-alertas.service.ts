import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Alerta, SeveridadAlerta, TipoAlerta } from '../../common/interfaces/alerta.interface';
import { Aula } from '../../common/interfaces/aula.interface';
import { InMemoryStore } from '../../common/store/in-memory.store';
import { Anomalia } from '../anomalias/detector-anomalias.service';
import {
  UMBRAL_SEVERIDAD_BAJA_MIN,
  UMBRAL_SEVERIDAD_MEDIA_MIN,
} from '../../common/constants/app.constants';

@Injectable()
export class GeneradorAlertasService {
  constructor(private readonly store: InMemoryStore) {}

  clasificarSeveridad(eficiencia: number): SeveridadAlerta {
    if (eficiencia >= UMBRAL_SEVERIDAD_BAJA_MIN) return 'Baja';
    if (eficiencia >= UMBRAL_SEVERIDAD_MEDIA_MIN) return 'Media';
    return 'Alta';
  }

  generarAlerta(tipo: TipoAlerta, aula: Aula, descripcion: string): Alerta {
    const alerta: Alerta = {
      id: uuidv4(),
      aulaId: aula.id,
      aulaNombre: aula.nombre,
      tipo,
      severidad: this.clasificarSeveridad(aula.eficiencia),
      descripcion,
      timestamp: new Date(),
      resuelta: false,
    };
    this.store.addAlerta(alerta);
    return alerta;
  }

  procesarAnomalias(aula: Aula, anomalias: Anomalia[]): Alerta[] {
    const alertasGeneradas: Alerta[] = [];

    for (const anomalia of anomalias) {
      let tipo: TipoAlerta;
      let descripcion: string;

      switch (anomalia.tipo) {
        case 'ConsumoElevado':
          tipo = 'Consumo Elevado';
          descripcion = `Consumo de ${anomalia.valor.toFixed(2)} kWh supera el 120% del promedio histórico en ${aula.nombre}`;
          break;
        case 'EficienciaBaja':
          tipo = 'Eficiencia Baja';
          descripcion = `Eficiencia del ${anomalia.valor.toFixed(2)}% está por debajo del umbral del 70% en ${aula.nombre}`;
          break;
        case 'ConsumoFueraHorario':
          tipo = 'Consumo Fuera de Horario';
          descripcion = `Consumo de ${anomalia.valor.toFixed(2)} kWh detectado fuera del horario operativo en ${aula.nombre}`;
          break;
      }

      // Verificar si ya existe una alerta activa del mismo tipo para esta aula
      const alertaExistente = this.store
        .getAlertasActivas()
        .find((a) => a.aulaId === aula.id && a.tipo === tipo && !a.resuelta);

      // Solo generar alerta si no existe una activa del mismo tipo
      if (!alertaExistente) {
        const alerta = this.generarAlerta(tipo, aula, descripcion);
        alertasGeneradas.push(alerta);
      }
    }

    return alertasGeneradas;
  }
}
