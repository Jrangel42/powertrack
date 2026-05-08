import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { InMemoryStore } from '../../common/store/in-memory.store';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
})
export class PowerTrackGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(PowerTrackGateway.name);

  constructor(private readonly store: InMemoryStore) {}

  afterInit() {
    this.logger.log('WebSocket Gateway inicializado');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);

    // Enviar estado actual al cliente que se conecta
    const aulas = this.store.getAllAulas();
    const alertasActivas = this.store.getAlertasActivas();

    client.emit('estado-inicial', { aulas, alertasActivas });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  /**
   * Emite actualización de métricas a todos los clientes conectados
   */
  emitirActualizacion(data: {
    aulas: any[];
    alertasActivas: any[];
    nuevasAlertas: any[];
  }) {
    // Emitir actualización de aulas
    this.server.emit('aulas_actualizadas', data.aulas);
    
    // Emitir cada alerta nueva
    for (const alerta of data.nuevasAlertas) {
      this.server.emit('alerta_generada', alerta);
    }
  }

  /**
   * Emite cuando se registra o elimina un aula
   */
  emitirCambioAulas(aulas: any[]) {
    this.server.emit('aulas_actualizadas', aulas);
  }
}
