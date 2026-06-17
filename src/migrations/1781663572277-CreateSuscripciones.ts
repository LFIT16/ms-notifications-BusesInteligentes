import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSuscripciones1781663572277 implements MigrationInterface {
    name = 'CreateSuscripciones1781663572277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`suscripciones\` (\`id\` int NOT NULL AUTO_INCREMENT, \`ciudadanoId\` int NOT NULL, \`rutaId\` int NOT NULL, \`paraderoId\` int NOT NULL, \`fcmToken\` varchar(255) NOT NULL, \`minutosAnticipacion\` int NOT NULL DEFAULT '5', \`activa\` tinyint NOT NULL DEFAULT 1, \`creadaEn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`actualizadaEn\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`notificaciones\` CHANGE \`tipo\` \`tipo\` enum ('bienvenida_grupo', 'salida_grupo', 'remocion_grupo', 'bloqueo_grupo', 'nuevo_mensaje', 'alerta_masiva', 'alerta_urgente') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notificaciones\` CHANGE \`tipo\` \`tipo\` enum ('bienvenida_grupo', 'salida_grupo', 'remocion_grupo', 'bloqueo_grupo', 'nuevo_mensaje', 'alerta_masiva', 'alerta_urgente') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`notificaciones\` CHANGE \`tipo\` \`tipo\` enum ('bienvenida_grupo', 'salida_grupo', 'remocion_grupo') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notificaciones\` CHANGE \`tipo\` \`tipo\` enum ('bienvenida_grupo', 'salida_grupo', 'remocion_grupo') NOT NULL`);
        await queryRunner.query(`DROP TABLE \`suscripciones\``);
    }

}
