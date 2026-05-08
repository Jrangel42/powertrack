import { Injectable } from '@nestjs/common';
import { Aula, HistorialEntry } from '../interfaces/aula.interface';
import { Alerta } from '../interfaces/alerta.interface';
import { MAX_HISTORIAL } from '../constants/app.constants';

@Injectable()
export class InMemoryStore {
  private aulas: Map<string, Aula> = new Map();
  private alertas: Alerta[] = [];

  // ─── Aulas ───────────────────────────────────────────────────────────────

  getAula(id: string): Aula | undefined {
    return this.aulas.get(id);
  }

  getAllAulas(): Aula[] {
    return Array.from(this.aulas.values());
  }

  saveAula(aula: Aula): void {
    this.aulas.set(aula.id, aula);
  }

  deleteAula(id: string): boolean {
    return this.aulas.delete(id);
  }

  aulaExists(id: string): boolean {
    return this.aulas.has(id);
  }

  // ─── Historial de consumo ─────────────────────────────────────────────────

  addHistorialEntry(aulaId: string, entry: HistorialEntry): void {
    const aula = this.aulas.get(aulaId);
    if (!aula) return;

    aula.historialConsumo.push(entry);

    // Mantener máximo MAX_HISTORIAL valores (FIFO)
    if (aula.historialConsumo.length > MAX_HISTORIAL) {
      aula.historialConsumo.shift();
    }
  }

  getHistorial(aulaId: string): HistorialEntry[] {
    return this.aulas.get(aulaId)?.historialConsumo ?? [];
  }

  // ─── Alertas ──────────────────────────────────────────────────────────────

  addAlerta(alerta: Alerta): void {
    this.alertas.push(alerta);
  }

  getAlertas(aulaId?: string): Alerta[] {
    if (aulaId) {
      return this.alertas.filter((a) => a.aulaId === aulaId);
    }
    return [...this.alertas];
  }

  getAlertasActivas(): Alerta[] {
    return this.alertas.filter((a) => !a.resuelta);
  }

  resolverAlerta(id: string, resolutionNotes?: string): boolean {
    const alerta = this.alertas.find((a) => a.id === id);
    if (!alerta) return false;
    alerta.resuelta = true;
    alerta.resolutionTime = new Date();
    if (resolutionNotes) {
      alerta.resolutionNotes = resolutionNotes;
    }
    return true;
  }

  getAlerta(id: string): Alerta | undefined {
    return this.alertas.find((a) => a.id === id);
  }
}
