import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket,
  OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/api/notificaciones' })
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server?: Server;
  private logger = new Logger(NotificationGateway.name);
  private usuariosConectados = new Map<string, string>();
  private contadorNotificaciones = new Map<string, number>();

  handleConnection(client: Socket) {
    const usuarioId = client.handshake.query.usuarioId as string;
    if (usuarioId) {
      this.usuariosConectados.set(usuarioId, client.id);
      this.logger.log(`🔔 Usuario conectado a notificaciones: ${usuarioId}`);
      
      const noLeidas = this.contadorNotificaciones.get(usuarioId) || 0;
      client.emit('contador_inicial', { noLeidas });
    }
  }

  handleDisconnect(client: Socket) {
    for (const [usuarioId, socketId] of this.usuariosConectados.entries()) {
      if (socketId === client.id) {
        this.usuariosConectados.delete(usuarioId);
        this.logger.log(`🔔 Usuario desconectado de notificaciones: ${usuarioId}`);
        break;
      }
    }
  }

  @SubscribeMessage('enviar_notificacion')
  async enviarNotificacion(
    @MessageBody() data: { usuarioId: string; titulo: string; mensaje: string; tipo: string; data?: any },
    @ConnectedSocket() client: Socket,
  ) {
    const socketId = this.usuariosConectados.get(data.usuarioId);
    
    if (socketId) {
      const notificacion = {
        id: Date.now().toString(),
        ...data,
        fecha: new Date(),
        leido: false,
      };
      
      const actual = this.contadorNotificaciones.get(data.usuarioId) || 0;
      this.contadorNotificaciones.set(data.usuarioId, actual + 1);
      
      this.server?.to(socketId).emit('nueva_notificacion', notificacion);
      this.logger.log(`🔔 Notificación enviada a ${data.usuarioId}: ${data.titulo}`);
    }
  }

  @SubscribeMessage('marcar_leida')
  marcarLeida(
    @MessageBody() data: { usuarioId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const actual = this.contadorNotificaciones.get(data.usuarioId) || 0;
    const nuevo = Math.max(0, actual - 1);
    this.contadorNotificaciones.set(data.usuarioId, nuevo);
    
    client.emit('contador_actualizado', { noLeidas: nuevo });
  }
}