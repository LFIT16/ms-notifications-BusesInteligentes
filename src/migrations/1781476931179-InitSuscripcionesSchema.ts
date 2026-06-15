import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSuscripcionesSchema1781476931179 implements MigrationInterface {
    name = 'InitSuscripcionesSchema1781476931179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`suscripciones\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ciudadanoId\` int NOT NULL, \`rutaId\` int NOT NULL, \`paraderoId\` int NOT NULL, \`fcmToken\` varchar(255) NOT NULL, \`minutosAnticipacion\` int NOT NULL DEFAULT '5', \`activa\` tinyint NOT NULL DEFAULT 1, \`creadaEn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`actualizadaEn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`suscripciones\``);
    }

}
