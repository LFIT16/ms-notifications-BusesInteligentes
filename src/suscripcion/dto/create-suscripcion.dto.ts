import { IsNumber, IsString, IsIn, Min } from 'class-validator';

export class CreateSuscripcionDto {
  @IsNumber()
  ciudadanoId?: number;

  @IsNumber()
  rutaId?: number;

  @IsNumber()
  paraderoId?: number;

  @IsString()
  fcmToken?: string;

  @IsIn([5, 10, 15])
  minutosAnticipacion?  : number;
}