import { Injectable, NotFoundException } from '@nestjs/common';
import { InMemoryStore } from '../../common/store/in-memory.store';
import { Alerta } from '../../common/interfaces/alerta.interface';

@Injectable()
export class AlertasService {
  constructor(private readonly store: InMemoryStore) {}

  getAlertas(aulaId?: string): Alerta[] {
    return this.store.getAlertas(aulaId);
  }

  getAlertasActivas(): Alerta[] {
    return this.store.getAlertasActivas();
  }

  resolverAlerta(id: string, resolutionNotes?: string): Alerta {
    const resuelta = this.store.resolverAlerta(id, resolutionNotes);
    if (!resuelta) {
      throw new NotFoundException(`Alerta con id "${id}" no encontrada`);
    }
    return this.store.getAlerta(id)!;
  }
}
