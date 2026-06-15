import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService implements OnModuleInit {

  private readonly logger = new Logger(FirebaseService.name);

  constructor(
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {

    if (!admin.apps.length) {

      try {

        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: this.config.get<string>('FIREBASE_PROJECT_ID'),

            clientEmail:
              this.config.get<string>('FIREBASE_CLIENT_EMAIL'),

            privateKey:
              this.config
                .get<string>('FIREBASE_PRIVATE_KEY')
                ?.replace(/\\n/g, '\n'),
          }),
        });

        this.logger.log('✅ Firebase Admin inicializado correctamente');

      } catch (e: any) {

        console.error('🔥 ERROR INICIALIZANDO FIREBASE:', e);

        this.logger.error(
          e?.message || 'Error inicializando Firebase',
        );
      }
    }
  }

  async enviarNotificacion(
    token: string,
    titulo: string,
    cuerpo: string,
    data?: Record<string, string>,
  ): Promise<boolean> {

    try {

      this.logger.log('📤 Intentando enviar notificación...');
      this.logger.log(`📱 Token: ${token.substring(0, 25)}...`);
      this.logger.log(`📝 Título: ${titulo}`);
      this.logger.log(`📦 Data: ${JSON.stringify(data)}`);

      const response = await admin.messaging().send({

        token,

        notification: {
          title: titulo,
          body: cuerpo,
        },

        data: data || {},

        webpush: {
          notification: {
            title: titulo,
            body: cuerpo,

            icon: '/assets/img/bus-icon.png',

            badge: '/assets/img/badge.png',

            requireInteraction: true,
          },

          fcmOptions: {
            link:
              `${this.config.get('FRONTEND_URL')}/#/paraderos/cercanos`,
          },
        },
      });

      this.logger.log(
        `✅ Notificación enviada correctamente`,
      );

      this.logger.log(
        `🔥 Firebase response: ${response}`,
      );

      return true;

    } catch (e: any) {

      console.error(
        '🔥 ERROR FIREBASE COMPLETO:',
        e,
      );

      this.logger.error(
        `❌ Error enviando notificación: ${
          e?.errorInfo?.message ||
          e?.message ||
          'desconocido'
        }`,
      );

      // token inválido
      if (
        e?.errorInfo?.code ===
        'messaging/registration-token-not-registered'
      ) {

        this.logger.warn(
          '⚠️ El token FCM ya no es válido',
        );
      }

      return false;
    }
  }
}