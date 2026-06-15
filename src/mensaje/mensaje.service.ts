import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mensaje } from './entities/mensaje.entity';
import { CreateMensajeDto } from './dto/create-mensaje.dto';

@Injectable()
export class MensajeService {
  constructor(
    @InjectRepository(Mensaje)
    private readonly repo: Repository<Mensaje>,
  ) {}

  async crear(emisorId: string, dto: CreateMensajeDto): Promise<Mensaje> {
    const mensaje = this.repo.create({
      emisorId,
      destinatarioId: dto.destinatarioId,
      contenido: dto.contenido,
      latitud: dto.latitud ?? null,
      longitud: dto.longitud ?? null,
      leido: false,
      fechaLeido: null,
    });
    return this.repo.save(mensaje);
  }

  async getConversacion(userId1: string, userId2: string): Promise<Mensaje[]> {
    return this.repo.find({
      where: [
        { emisorId: userId1, destinatarioId: userId2 },
        { emisorId: userId2, destinatarioId: userId1 },
      ],
      order: { fechaEnvio: 'ASC' },
    });
  }

  async getEnviados(emisorId: string): Promise<Mensaje[]> {
    return this.repo.find({
      where: { emisorId },
      order: { fechaEnvio: 'DESC' },
    });
  }

  async getRecibidos(destinatarioId: string): Promise<Mensaje[]> {
    return this.repo.find({
      where: { destinatarioId },
      order: { fechaEnvio: 'DESC' },
    });
  }

  async marcarLeido(mensajeId: number, userId: string): Promise<Mensaje | null> {
    const mensaje = await this.repo.findOne({
      where: { id: mensajeId, destinatarioId: userId },
    });
    if (!mensaje) return null;
    mensaje.leido = true;
    mensaje.fechaLeido = new Date();
    return this.repo.save(mensaje);
  }

  async getNoLeidos(destinatarioId: string): Promise<number> {
    return this.repo.count({
      where: { destinatarioId, leido: false },
    });
  }
}