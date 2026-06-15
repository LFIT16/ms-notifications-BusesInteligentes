import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('suscripciones')
export class Suscripcion {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  ciudadanoId?: number;

  @Column()
  rutaId?: number;

  @Column()
  paraderoId?: number;

  @Column()
  fcmToken?: string;

  @Column({ type: 'int', default: 5 })
  minutosAnticipacion?: number; // 5, 10 o 15 minutos

  @Column({ default: true })
  activa?: boolean;

  @CreateDateColumn()
  creadaEn?: Date;

  @UpdateDateColumn()
  actualizadaEn?: Date;
}