import { Controller, Post, Body } from '@nestjs/common';

@Controller('/api/notificaciones')
export class NotificacionesController {
  @Post('test')
  test() {
    return { message: 'ms-notificaciones activo' };
  }
}