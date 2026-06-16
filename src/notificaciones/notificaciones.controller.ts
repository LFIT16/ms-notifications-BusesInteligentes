import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';

@Controller('/api/notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  // ── Internos ──────────────────────────────────────────────────────────────
  @Post('grupos/bienvenida')
  notificarBienvenida(@Body() dto: any) {
    return this.notificacionesService.notificarBienvenida(dto);
  }

  @Post('grupos/salida')
  notificarSalida(@Body() dto: any) {
    return this.notificacionesService.notificarSalida(dto);
  }

  @Post('grupos/remocion')
  notificarRemocion(@Body() dto: any) {
    return this.notificacionesService.notificarRemocion(dto);
  }

  @Post('grupos/bloqueo')
  notificarBloqueo(@Body() dto: any) {
    return this.notificacionesService.notificarBloqueo(dto);
  }

  @Post('grupos/nuevo-mensaje')
  notificarNuevoMensaje(@Body() dto: any) {
    return this.notificacionesService.notificarNuevoMensaje(dto);
  }

  @Post('alerta-masiva')
  notificarAlertaMasiva(@Body() dto: any) {
    return this.notificacionesService.notificarAlertaMasiva(dto);
  }

  // ── Frontend ──────────────────────────────────────────────────────────────
  @Get('usuario/:usuarioId')
  listarPorUsuario(@Param('usuarioId') usuarioId: string) {
    return this.notificacionesService.listarPorUsuario(usuarioId);
  }

  @Get('usuario/:usuarioId/no-leidas')
  contarNoLeidas(@Param('usuarioId') usuarioId: string) {
    return this.notificacionesService.contarNoLeidas(usuarioId);
  }

  @Patch(':id/leer')
  marcarLeida(@Param('id') id: string) {
    return this.notificacionesService.marcarLeida(+id);
  }

  @Patch('usuario/:usuarioId/leer-todas')
  marcarTodasLeidas(@Param('usuarioId') usuarioId: string) {
    return this.notificacionesService.marcarTodasLeidas(usuarioId);
  }
}
