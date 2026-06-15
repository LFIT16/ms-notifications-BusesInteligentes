import { Module } from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { NotificacionesController } from './notificaciones.controller';
import { SuscripcionModule } from '../suscripcion/suscripcion.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [SuscripcionModule, FirebaseModule],
  providers: [NotificacionesService],
  controllers: [NotificacionesController],
})
export class NotificacionesModule {}