import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export enum TipoNotificacion {
  BIENVENIDA_GRUPO = 'bienvenida_grupo',
  SALIDA_GRUPO     = 'salida_grupo',
  REMOCION_GRUPO   = 'remocion_grupo',
  BLOQUEO_GRUPO    = 'bloqueo_grupo',
  NUEVO_MENSAJE    = 'nuevo_mensaje',
  ALERTA_MASIVA    = 'alerta_masiva',
  ALERTA_URGENTE   = 'alerta_urgente',
  
}

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ name: 'usuario_id' })
  usuarioId!: string;

  @Column({ type: 'enum', enum: TipoNotificacion })
  tipo!: TipoNotificacion;

  @Column()
  titulo!: string;

  @Column({ type: 'text' })
  mensaje!: string;

  @Column({ default: false })
  leido!: boolean;

  @Column({ name: 'referencia_id', nullable: true })
  referenciaId?: number;

  @CreateDateColumn({ name: 'fecha_creacion' })
  fechaCreacion?: Date;
}
