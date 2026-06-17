import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notificacion, TipoNotificacion } from './entities/notificacion.entity';

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger('NotificacionesService');

  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepo: Repository<Notificacion>,
  ) {}

  async notificarBienvenida(dto: { usuarioId: string; nombreGrupo: string; grupoId: number }) {
    return this.notificacionRepo.save(this.notificacionRepo.create({
      usuarioId:    dto.usuarioId,
      tipo:         TipoNotificacion.BIENVENIDA_GRUPO,
      titulo:       `¡Bienvenido al grupo "${dto.nombreGrupo}"!`,
      mensaje:      `Te has unido al grupo "${dto.nombreGrupo}" exitosamente.`,
      referenciaId: dto.grupoId,
      leido:        false,
    }));
  }

  async notificarSalida(dto: { grupoId: number; usuarioId: string; adminIds?: string[] }) {
    const notificaciones: Notificacion[] = [];
    for (const adminId of dto.adminIds ?? []) {
      notificaciones.push(await this.notificacionRepo.save(this.notificacionRepo.create({
        usuarioId:    adminId,
        tipo:         TipoNotificacion.SALIDA_GRUPO,
        titulo:       'Un miembro ha abandonado el grupo',
        mensaje:      `El usuario ha abandonado el grupo #${dto.grupoId}.`,
        referenciaId: dto.grupoId,
        leido:        false,
      })));
    }
    return notificaciones;
  }

  async notificarRemocion(dto: { usuarioId: string; grupoId: number }) {
    return this.notificacionRepo.save(this.notificacionRepo.create({
      usuarioId:    dto.usuarioId,
      tipo:         TipoNotificacion.REMOCION_GRUPO,
      titulo:       'Has sido removido de un grupo',
      mensaje:      `Un administrador te ha removido del grupo #${dto.grupoId}.`,
      referenciaId: dto.grupoId,
      leido:        false,
    }));
  }

  async notificarBloqueo(dto: { usuarioId: string; grupoId: number }) {
    return this.notificacionRepo.save(this.notificacionRepo.create({
      usuarioId:    dto.usuarioId,
      tipo:         TipoNotificacion.BLOQUEO_GRUPO,
      titulo:       'Has sido bloqueado de un grupo',
      mensaje:      `Un administrador te ha bloqueado del grupo #${dto.grupoId}.`,
      referenciaId: dto.grupoId,
      leido:        false,
    }));
  }

  // HU-ENTR-3-005: Notificar nuevo mensaje a miembros fuera del chat
  async notificarNuevoMensaje(dto: {
    grupoId: number;
    emisorId: string;
    nombreEmisor: string;
    mensajeId: number;
    destinatarios: string[];
  }) {
    const notificaciones: Notificacion[] = [];
    for (const usuarioId of dto.destinatarios) {
      if (usuarioId === dto.emisorId) continue;
      notificaciones.push(await this.notificacionRepo.save(this.notificacionRepo.create({
        usuarioId,
        tipo:         TipoNotificacion.NUEVO_MENSAJE,
        titulo:       `Nuevo mensaje de ${dto.nombreEmisor}`,
        mensaje:      `Tienes un nuevo mensaje en el grupo #${dto.grupoId}`,
        referenciaId: dto.grupoId,
        leido:        false,
      })));
    }
    return notificaciones;
  }

  // HU-ENTR-3-008: Alerta masiva
  async notificarAlertaMasiva(dto: {
    alertaId: number;
    titulo: string;
    mensaje: string;
    urgente: boolean;
    destinatarios: string[];
  }) {
    const notificaciones: Notificacion[] = [];
    for (const usuarioId of dto.destinatarios) {
      notificaciones.push(await this.notificacionRepo.save(this.notificacionRepo.create({
        usuarioId,
        tipo:         dto.urgente ? TipoNotificacion.ALERTA_URGENTE : TipoNotificacion.ALERTA_MASIVA,
        titulo:       dto.titulo,
        mensaje:      dto.mensaje,
        referenciaId: dto.alertaId,
        leido:        false,
      })));
    }
    return notificaciones;
  }

  async listarPorUsuario(usuarioId: string): Promise<Notificacion[]> {
    return this.notificacionRepo.find({
      where: { usuarioId },
      order: { fechaCreacion: 'DESC' },
    });
  }

  async contarNoLeidas(usuarioId: string): Promise<{ count: number }> {
    const count = await this.notificacionRepo.count({
      where: { usuarioId, leido: false },
    });
    return { count };
  }

  async marcarLeida(id: number): Promise<Notificacion> {
    const notif = await this.notificacionRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException(`Notificación #${id} no encontrada`);
    notif.leido = true;
    return this.notificacionRepo.save(notif);
  }

  async marcarTodasLeidas(usuarioId: string): Promise<{ message: string }> {
    await this.notificacionRepo.update({ usuarioId, leido: false }, { leido: true });
    return { message: 'Todas las notificaciones marcadas como leídas' };
  }
}
