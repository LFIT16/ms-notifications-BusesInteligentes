import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('mensajes')
export class Mensaje {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  emisorId?: string;

  @Column()
  destinatarioId?: string;

  @Column({ length: 500 })
  contenido?: string;

  @Column({ default: false })
  leido?: boolean;

  @Column({ type: 'datetime', nullable: true })
  fechaLeido?: Date | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitud?: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitud?: number | null;

  @CreateDateColumn()
  fechaEnvio?: Date;
}