import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Suscripcion } from './entities/suscripcion.entity';
import { CreateSuscripcionDto } from './dto/create-suscripcion.dto';

@Injectable()
export class SuscripcionService {
  constructor(
    @InjectRepository(Suscripcion)
    private readonly repo: Repository<Suscripcion>,
  ) {}

  async crear(dto: CreateSuscripcionDto): Promise<Suscripcion> {
    // Si ya existe una suscripción para este ciudadano+ruta+paradero, la actualiza
    const existente = await this.repo.findOne({
      where: {
        ciudadanoId: dto.ciudadanoId,
        rutaId: dto.rutaId,
        paraderoId: dto.paraderoId,
      },
    });

    if (existente) {
      existente.fcmToken = dto.fcmToken;
      existente.minutosAnticipacion = dto.minutosAnticipacion;
      existente.activa = true;
      return this.repo.save(existente);
    }

    const suscripcion = this.repo.create(dto);
    return this.repo.save(suscripcion);
  }

  async findActivas(): Promise<Suscripcion[]> {
    return this.repo.find({ where: { activa: true } });
  }

  async desactivar(id: number): Promise<{ message: string }> {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException(`Suscripción #${id} no encontrada`);
    s.activa = false;
    await this.repo.save(s);
    return { message: `Suscripción #${id} desactivada` };
  }

  async findPorCiudadano(ciudadanoId: number): Promise<Suscripcion[]> {
    return this.repo.find({ where: { ciudadanoId, activa: true } });
  }
}