import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InMemoryStore } from '../../common/store/in-memory.store';
import { Aula } from '../../common/interfaces/aula.interface';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

@Injectable()
export class AulasService {
  constructor(private readonly store: InMemoryStore) {}

  crearAula(dto: CreateAulaDto): Aula {
    if (dto.horarioCierre <= dto.horarioInicio) {
      throw new BadRequestException(
        'El horario de cierre debe ser mayor al horario de inicio',
      );
    }

    const now = new Date();
    const aula: Aula = {
      id: uuidv4(),
      nombre: dto.nombre.trim(),
      horarioInicio: dto.horarioInicio,
      horarioCierre: dto.horarioCierre,
      consumoEsperado: dto.consumoEsperado,
      consumoActual: 0,
      eficiencia: 100,
      estado: 'Normal',
      historialConsumo: [],
      ultimaActualizacion: now,
      createdAt: now,
      updatedAt: now,
    };

    this.store.saveAula(aula);
    return aula;
  }

  obtenerAulas(): Aula[] {
    return this.store.getAllAulas();
  }

  obtenerAula(id: string): Aula {
    const aula = this.store.getAula(id);
    if (!aula) {
      throw new NotFoundException(`Aula con id "${id}" no encontrada`);
    }
    return aula;
  }

  actualizarAula(id: string, dto: UpdateAulaDto): Aula {
    const aula = this.obtenerAula(id);

    const horarioInicio = dto.horarioInicio ?? aula.horarioInicio;
    const horarioCierre = dto.horarioCierre ?? aula.horarioCierre;

    if (horarioCierre <= horarioInicio) {
      throw new BadRequestException(
        'El horario de cierre debe ser mayor al horario de inicio',
      );
    }

    const aulaActualizada: Aula = {
      ...aula,
      nombre: dto.nombre?.trim() ?? aula.nombre,
      horarioInicio,
      horarioCierre,
      consumoEsperado: dto.consumoEsperado ?? aula.consumoEsperado,
      updatedAt: new Date(),
    };

    this.store.saveAula(aulaActualizada);
    return aulaActualizada;
  }

  eliminarAula(id: string): void {
    const exists = this.store.aulaExists(id);
    if (!exists) {
      throw new NotFoundException(`Aula con id "${id}" no encontrada`);
    }
    this.store.deleteAula(id);
  }
}
