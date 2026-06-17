import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SuscripcionService } from '../suscripcion/suscripcion.service';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class NotificacionesService {
  private readonly logger = new Logger(NotificacionesService.name);

  constructor(
    private readonly suscripcionesService: SuscripcionService,
    private readonly firebaseService: FirebaseService,
    private readonly config: ConfigService,
  ) {}

  // Headers que identifican al ms-notificaciones como servicio interno
  private get internalHeaders() {
    return {
      'x-internal-api-key': this.config.get<string>('INTERNAL_API_KEY'),
    };
  }

  @Cron('*/30 * * * * *')
  async verificarBusesCercanos() {
    const suscripciones = await this.suscripcionesService.findActivas();;

    if (suscripciones.length === 0) {
      this.logger.log('⚠️ No hay suscripciones activas, saltando...');
      return;
    }

    for (const sus of suscripciones) {

      if (!sus.fcmToken || sus.id == null) {
        this.logger.warn(`⚠️ Suscripción ${sus.id} sin FCM token, saltando...`);
        continue;
      }

      try {
        const msBusinessUrl = this.config.get<string>('MS_BUSINESS') || 'http://localhost:3000';

        const urlBuses = `${msBusinessUrl}/monitoreo/ruta/${sus.rutaId}/activos`;

        // ✅ Enviamos la API key interna para pasar el guard
        const { data: buses } = await axios.get(urlBuses, {
          headers: this.internalHeaders,
        });

        if (!buses || buses.length === 0) continue;

        for (const bus of buses) {
          try {
            const urlEta = `${msBusinessUrl}/monitoreo/bus/${bus.busId}/eta/${sus.paraderoId}`;

            // ✅ También en la llamada de ETA
            const { data: eta } = await axios.get(urlEta, {
              headers: this.internalHeaders,
            });

            const etaMinutos: number | null = eta?.etaMinutos ?? null;
            const umbral = sus.minutosAnticipacion ?? 5;

            this.logger.log(`⏱ Bus ${bus.placa} (ID: ${bus.busId}) - ETA: ${etaMinutos} min | Umbral: ${umbral} min`);

            if (etaMinutos === null) {
              this.logger.warn(`⚠️ No se pudo calcular ETA para bus ${bus.busId}`);
              continue;
            }

            if (etaMinutos <= umbral && etaMinutos >= 0) {
              this.logger.log(`🚨 ENVIANDO NOTIFICACIÓN para bus ${bus.placa} a ciudadano ${sus.ciudadanoId}`);

              const resultado = await this.firebaseService.enviarNotificacion(
                sus.fcmToken,
                `🚌 Tu bus llega en ${etaMinutos} minutos`,
                `${bus.ruta?.nombre || 'Tu ruta'} — Bus ${bus.placa} llegará a tu paradero pronto.`,
                {
                  busId:      String(bus.busId),
                  placa:      bus.placa      || '',
                  rutaId:     String(sus.rutaId),
                  paraderoId: String(sus.paraderoId),
                  etaMinutos: String(etaMinutos),
                  nombreRuta: bus.ruta?.nombre || '',
                },
              );

              if (resultado) {
                this.logger.log(`✅ Notificación enviada exitosamente para bus ${bus.placa}`);
                await this.suscripcionesService.desactivar(sus.id);
                this.logger.log(`🔕 Suscripción ${sus.id} desactivada`);
              } else {
                this.logger.error(`❌ Falló el envío de notificación para bus ${bus.placa}`);
              }
            }
          } catch (e) {
            const error = e as Error;
            this.logger.warn(`Error calculando ETA bus ${bus.busId}: ${error.message}`);
          }
        }
      } catch (e) {
        const error = e as Error;
        this.logger.warn(`Error procesando suscripción ${sus.id}: ${error.message}`);
      }
    }
  }
  
}