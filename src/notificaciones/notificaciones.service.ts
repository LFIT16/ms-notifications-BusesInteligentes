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

  @Cron('*/30 * * * * *')
  async verificarBusesCercanos() {
    this.logger.log('🔍 CRON ejecutándose a las: ' + new Date().toISOString());
    
    const suscripciones = await this.suscripcionesService.findActivas();
    
    this.logger.log(`📋 Suscripciones activas encontradas: ${suscripciones.length}`);

    if (suscripciones.length === 0) {
      this.logger.log('⚠️ No hay suscripciones activas, saltando...');
      return;
    }

    for (const sus of suscripciones) {
      this.logger.log(`📍 Procesando suscripción ID: ${sus.id}, Ciudadano: ${sus.ciudadanoId}, Ruta: ${sus.rutaId}, Paradero: ${sus.paraderoId}, Umbral: ${sus.minutosAnticipacion} min`);
      
      // Guard: saltar si faltan datos esenciales
      if (!sus.fcmToken || sus.id == null) {
        this.logger.warn(`⚠️ Suscripción ${sus.id} sin FCM token, saltando...`);
        continue;
      }

      try {
        const msBusinessUrl = this.config.get<string>('MS_BUSINESS') || 'http://localhost:3000';
        this.logger.log(`🌐 Usando MS_BUSINESS_URL: ${msBusinessUrl}`);

        const urlBuses = `${msBusinessUrl}/monitoreo/ruta/${sus.rutaId}/activos`;
        this.logger.log(`🚌 Consultando buses en: ${urlBuses}`);
        
        const { data: buses } = await axios.get(urlBuses);

        this.logger.log(`🚌 Buses encontrados para ruta ${sus.rutaId}: ${buses?.length || 0}`);

        if (!buses || buses.length === 0) continue;

        for (const bus of buses) {
          try {
            const urlEta = `${msBusinessUrl}/monitoreo/bus/${bus.busId}/eta/${sus.paraderoId}`;
            const { data: eta } = await axios.get(urlEta);

            const etaMinutos: number | null = eta?.etaMinutos ?? null;
            const umbral = sus.minutosAnticipacion ?? 5;

            this.logger.log(`⏱ Bus ${bus.placa} (ID: ${bus.busId}) - ETA: ${etaMinutos} min | Umbral: ${umbral} min`);

            if (etaMinutos === null) {
              this.logger.warn(`⚠️ No se pudo calcular ETA para bus ${bus.busId}`);
              continue;
            }

            if (etaMinutos <= umbral && etaMinutos >= 0) {
              this.logger.log(`🚨 ENVIANDO NOTIFICACIÓN para bus ${bus.placa} a ciudadano ${sus.ciudadanoId}`);
              this.logger.log(`📱 Token FCM: ${sus.fcmToken.substring(0, 20)}...`);

              const resultado = await this.firebaseService.enviarNotificacion(
                sus.fcmToken,
                `🚌 Tu bus llega en ${etaMinutos} minutos`,
                `${bus.ruta?.nombre || 'Tu ruta'} — Bus ${bus.placa} llegará a tu paradero pronto.`,
                {
                  busId: String(bus.busId),
                  placa: bus.placa || '',
                  rutaId: String(sus.rutaId),
                  paraderoId: String(sus.paraderoId),
                  etaMinutos: String(etaMinutos),
                  tipo: 'bus_proximo',
                },
              );

              if (resultado) {
                this.logger.log(`✅ Notificación enviada exitosamente para bus ${bus.placa}`);
                // Desactivar para no spamear
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