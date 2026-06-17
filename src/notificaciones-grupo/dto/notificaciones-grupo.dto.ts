import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class NotificarBienvenidaDto {
  @IsString() @IsNotEmpty() usuarioId!: string;
  @IsString() @IsNotEmpty() nombreGrupo!: string;
  @Type(() => Number) @IsNumber() grupoId!: number;
}

export class NotificarSalidaDto {
  @Type(() => Number) @IsNumber() grupoId!: number;
  @IsString() @IsNotEmpty() usuarioId!: string;
  @IsOptional() adminIds?: string[];
}

export class NotificarRemocionDto {
  @IsString() @IsNotEmpty() usuarioId!: string;
  @Type(() => Number) @IsNumber() grupoId!: number;
}

export class NotificarBloqueoDto {
  @IsString() @IsNotEmpty() usuarioId!: string;
  @Type(() => Number) @IsNumber() grupoId!: number;
}
