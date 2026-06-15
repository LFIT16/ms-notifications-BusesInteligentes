import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMensaje1781496638087 implements MigrationInterface {
    name = 'AddMensaje1781496638087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`mensajes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`emisorId\` varchar(255) NOT NULL, \`destinatarioId\` varchar(255) NOT NULL, \`contenido\` varchar(500) NOT NULL, \`leido\` tinyint NOT NULL DEFAULT 0, \`fechaLeido\` datetime NULL, \`latitud\` decimal(10,7) NULL, \`longitud\` decimal(10,7) NULL, \`fechaEnvio\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`mensajes\``);
    }

}
