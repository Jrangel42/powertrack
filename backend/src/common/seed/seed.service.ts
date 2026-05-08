import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { AulasService } from '../../modules/aulas/aulas.service';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly aulasService: AulasService) {}

  onModuleInit() {
    this.sembrarDatos();
  }

  private sembrarDatos() {
    const aulasIniciales = [
      { nombre: 'Aula 101', horarioInicio: 6, horarioCierre: 22, consumoEsperado: 45 },
      { nombre: 'Aula 202', horarioInicio: 6, horarioCierre: 22, consumoEsperado: 60 },
      { nombre: 'Laboratorio A', horarioInicio: 8, horarioCierre: 20, consumoEsperado: 90 },
      { nombre: 'Sala de Cómputo', horarioInicio: 7, horarioCierre: 21, consumoEsperado: 120 },
      { nombre: 'Auditorio', horarioInicio: 8, horarioCierre: 18, consumoEsperado: 75 },
    ];

    for (const dto of aulasIniciales) {
      this.aulasService.crearAula(dto);
    }

    this.logger.log(`Seed completado: ${aulasIniciales.length} aulas creadas`);
  }
}
