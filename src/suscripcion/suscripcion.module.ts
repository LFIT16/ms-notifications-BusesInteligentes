import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Suscripcion } from './entities/suscripcion.entity';
import { SuscripcionService } from './suscripcion.service';
import { SuscripcionController } from './suscripcion.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Suscripcion])],
  providers: [SuscripcionService],
  controllers: [SuscripcionController],
  exports: [SuscripcionService],
})
export class SuscripcionModule {}