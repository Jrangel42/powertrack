import { io, Socket } from 'socket.io-client';
import { Aula, Alerta } from '../types';

const SOCKET_URL = 'http://localhost:3000';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect() {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket conectado');
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket desconectado:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Error de conexión WebSocket:', error);
      this.reconnectAttempts++;
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`Intento de reconexión ${attempt}/${this.maxReconnectAttempts}`);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('Falló la reconexión WebSocket');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  onAulasActualizadas(callback: (aulas: Aula[]) => void) {
    this.socket?.on('aulas_actualizadas', callback);
  }

  onAlertaGenerada(callback: (alerta: Alerta) => void) {
    this.socket?.on('alerta_generada', callback);
  }

  offAulasActualizadas(callback: (aulas: Aula[]) => void) {
    this.socket?.off('aulas_actualizadas', callback);
  }

  offAlertaGenerada(callback: (alerta: Alerta) => void) {
    this.socket?.off('alerta_generada', callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const webSocketService = new WebSocketService();