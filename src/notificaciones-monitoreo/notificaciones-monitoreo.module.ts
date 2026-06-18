import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { SuscripcionModule } from '../suscripcion/suscripcion.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationGateway } from './notificaciones.gateway';

@Module({
  imports: [SuscripcionModule, FirebaseModule],
  providers: [NotificacionesService, NotificationGateway],
  controllers: [NotificacionesController],
  exports: [NotificacionesService, NotificationGateway],
})
export class NotificacionesMonitoreoModule {}