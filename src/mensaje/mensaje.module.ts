import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { DestinatarioPersona } from '../destinatario-persona/entities/destinatario-persona.entity';
import { MensajeService } from './mensaje.service';
import { MensajeController } from './mensaje.controller';
import { MensajeGateway } from './mensaje.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mensaje, DestinatarioPersona]),
  ],
  providers: [MensajeService, MensajeGateway],
  controllers: [MensajeController],
  exports: [MensajeService],
})
export class MensajeModule {}