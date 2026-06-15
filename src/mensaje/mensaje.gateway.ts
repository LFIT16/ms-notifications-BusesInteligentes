import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MensajeService } from './mensaje.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/api/mensajes',
})
export class MensajeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server?: Server;

  private readonly logger = new Logger(MensajeGateway.name);
  private usuariosConectados = new Map<string, string>();

  constructor(private readonly mensajeService: MensajeService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.usuariosConectados.set(userId, client.id);
      this.logger.log(`Usuario ${userId} conectado (socket: ${client.id})`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.usuariosConectados.entries()) {
      if (socketId === client.id) {
        this.usuariosConectados.delete(userId);
        this.logger.log(`Usuario ${userId} desconectado`);
        break;
      }
    }
  }

  @SubscribeMessage('enviar_mensaje')
  async handleEnviarMensaje(
    @MessageBody() data: { emisorId: string; dto: CreateMensajeDto },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const mensaje = await this.mensajeService.crear(data.emisorId, data.dto);

      // Confirmar al emisor
      client.emit('mensaje_enviado', mensaje);

      // Entregar al destinatario si está conectado
      const socketDestinatario = this.usuariosConectados.get(data.dto.destinatarioId?.toString() || '');
      if (socketDestinatario) {
        this.server?.to(socketDestinatario).emit('mensaje_recibido', mensaje);
        this.logger.log(`Mensaje entregado en tiempo real a ${data.dto.destinatarioId}`);
      } else {
        this.logger.log(`Usuario ${data.dto.destinatarioId} no conectado — guardado en BD`);
      }

      return mensaje;
    } catch (e) {
      const error = e as Error;
      client.emit('error_mensaje', { message: error.message });
    }
  }

  @SubscribeMessage('marcar_leido')
  async handleMarcarLeido(
    @MessageBody() data: { mensajeId: number; userId: string },
  ) {
    const mensaje = await this.mensajeService.marcarLeido(data.mensajeId, data.userId);

    if (mensaje) {
      const socketEmisor = this.usuariosConectados.get(mensaje.emisorId?.toString() || '');
      if (socketEmisor) {
        this.server?.to(socketEmisor).emit('mensaje_leido', {
          mensajeId: mensaje.id,
          fechaLeido: mensaje.fechaLeido,
        });
      }
    }

    return mensaje;
  }

  @SubscribeMessage('obtener_conversacion')
  async handleObtenerConversacion(
    @MessageBody() data: { userId1: string; userId2: string },
  ) {
    return this.mensajeService.getConversacion(data.userId1, data.userId2);
  }
}