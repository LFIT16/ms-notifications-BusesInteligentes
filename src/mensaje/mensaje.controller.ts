import {
  Controller, Get, Post, Body,
  Param, Patch,
} from '@nestjs/common';
import { MensajeService } from './mensaje.service';
import { CreateMensajeDto } from './dto/create-mensaje.dto';

@Controller('/api/mensajes')
export class MensajeController {
  constructor(private readonly service: MensajeService) {}

  @Post(':emisorId')
  crear(
    @Param('emisorId') emisorId: string,
    @Body() dto: CreateMensajeDto,
  ) {
    return this.service.crear(emisorId, dto);
  }

  @Get('conversacion/:userId1/:userId2')
  conversacion(
    @Param('userId1') userId1: string,
    @Param('userId2') userId2: string,
  ) {
    return this.service.getConversacion(userId1, userId2);
  }

  @Get('enviados/:emisorId')
  enviados(@Param('emisorId') emisorId: string) {
    return this.service.getEnviados(emisorId);
  }

  @Get('recibidos/:destinatarioId')
  recibidos(@Param('destinatarioId') destinatarioId: string) {
    return this.service.getRecibidos(destinatarioId);
  }

  @Get('no-leidos/:destinatarioId')
  noLeidos(@Param('destinatarioId') destinatarioId: string) {
    return this.service.getNoLeidos(destinatarioId);
  }

  @Patch('leer/:mensajeId/:userId')
  marcarLeido(
    @Param('mensajeId') mensajeId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.marcarLeido(Number(mensajeId), userId);
  }
}