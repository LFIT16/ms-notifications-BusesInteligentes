import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { MensajeService } from './mensaje.service';
import { MensajeController } from './mensaje.controller';
import { MensajeGateway } from './mensaje.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Mensaje])],
  providers: [MensajeService, MensajeGateway],
  controllers: [MensajeController],
})
export class MensajeModule {}