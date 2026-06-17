import { Controller, Post, Get, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { SuscripcionService } from './suscripcion.service';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';

@Controller('/api/suscripciones')
export class SuscripcionController {
  constructor(private readonly service: SuscripcionService) {}

  // 🔥 ENDPOINT DE PRUEBA
  @Get('ping')
  ping() {
    return { 
      message: 'pong', 
      timestamp: new Date().toISOString(),
      service: 'suscripciones'
    };
  }

  @Post()
  crear(@Body() dto: CreateSuscripcionDto) {
    return this.service.crear(dto);
  }

  @Get('ciudadano/:id')
  porCiudadano(@Param('id', ParseIntPipe) id: number) {
    return this.service.findPorCiudadano(id);
  }

  @Delete(':id')
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.service.desactivar(id);
  }
}