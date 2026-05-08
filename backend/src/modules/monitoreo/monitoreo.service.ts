import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { InMemoryStore } from '../../common/store/in-memory.store';
import { SimuladorService } from '../consumo/simulador.service';
import { EficienciaService } from '../eficiencia/eficiencia.service';
import { DetectorAnomaliasService } from '../anomalias/detector-anomalias.service';
import { GeneradorAlertasService } from '../alertas/generador-alertas.service';
import { ClasificadorEstadoService } from '../estado/clasificador-estado.service';
import { PowerTrackGateway } from '../websocket/powertrack.gateway';
import { INTERVALO_SIMULACION_MS } from '../../common/constants/app.constants';
import { Aula } from '../../common/interfaces/aula.interface';

@Injectable()
export class MonitoreoService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MonitoreoService.name);
  private intervalo: NodeJS.Timeout | null = null;

  constructor(
    private readonly store: InMemoryStore,
    private readonly simulador: SimuladorService,
    private readonly eficiencia: EficienciaService,
    private readonly detector: DetectorAnomaliasService,
    private readonly generadorAlertas: GeneradorAlertasService,
    private readonly clasificador: ClasificadorEstadoService,
    private readonly gateway: PowerTrackGateway,
  ) {}

  onModuleInit() {
    this.iniciarSimulacion();
  }

  onModuleDestroy() {
    this.detenerSimulacion();
  }

  iniciarSimulacion() {
    this.logger.log('Iniciando simulación de consumo energético...');
    this.intervalo = setInterval(() => {
      this.procesarCiclo();
    }, INTERVALO_SIMULACION_MS);
  }

  detenerSimulacion() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
      this.logger.log('Simulación detenida');
    }
  }

  procesarCiclo() {
    const aulas = this.store.getAllAulas();
    if (aulas.length === 0) return;

    const horaActual = this.simulador.getHoraActual();
    const esDiaLaboral = this.simulador.esDiaLaboral();
    const nuevasAlertas: any[] = [];

    for (const aula of aulas) {
      this.procesarAula(aula, horaActual, esDiaLaboral, nuevasAlertas);
    }

    // Emitir actualización a todos los clientes
    this.gateway.emitirActualizacion({
      aulas: this.store.getAllAulas(),
      alertasActivas: this.store.getAlertasActivas(),
      nuevasAlertas,
    });
  }

  private procesarAula(
    aula: Aula,
    horaActual: number,
    esDiaLaboral: boolean,
    nuevasAlertas: any[],
  ) {
    // 1. Generar consumo simulado
    const consumoNuevo = this.simulador.generarConsumo(
      aula,
      horaActual,
      esDiaLaboral,
    );

    // 2. Calcular eficiencia
    const eficienciaNueva = this.eficiencia.calcularEficiencia(
      consumoNuevo,
      aula.consumoEsperado,
    );

    // 3. Clasificar estado
    const estadoNuevo = this.clasificador.clasificarEstado(eficienciaNueva);

    // 4. Calcular promedio histórico para detección de anomalías
    const historialConsumos = aula.historialConsumo.map((h) => h.valor);
    const promedio =
      historialConsumos.length > 0
        ? this.eficiencia.calcularPromedio(historialConsumos)
        : aula.consumoEsperado;

    // 5. Detectar anomalías
    const aulaActualizada: Aula = {
      ...aula,
      consumoActual: consumoNuevo,
      eficiencia: eficienciaNueva,
      estado: estadoNuevo,
      ultimaActualizacion: new Date(),
      updatedAt: new Date(),
    };

    const anomalias = this.detector.detectarAnomalias(
      aulaActualizada,
      promedio,
      horaActual,
      esDiaLaboral,
    );

    // 6. Agregar entrada al historial
    const esAnomalia = anomalias.length > 0;
    this.store.addHistorialEntry(aula.id, {
      valor: consumoNuevo,
      eficiencia: eficienciaNueva,
      timestamp: new Date(),
      esAnomalia,
    });

    // 7. Actualizar aula en store
    this.store.saveAula(aulaActualizada);

    // 8. Generar alertas si hay anomalías
    if (anomalias.length > 0) {
      const alertas = this.generadorAlertas.procesarAnomalias(
        aulaActualizada,
        anomalias,
      );
      nuevasAlertas.push(...alertas);
    }
  }
}
