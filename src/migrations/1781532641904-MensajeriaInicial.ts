import { MigrationInterface, QueryRunner } from "typeorm";

export class MensajeriaInicial1781532641904 implements MigrationInterface {
    name = 'MensajeriaInicial1781532641904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`mensajes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`emisor_id\` varchar(255) NOT NULL, \`contenido\` varchar(500) NOT NULL, \`latitud\` decimal(10,7) NULL, \`longitud\` decimal(10,7) NULL, \`fecha_envio\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`destinatario_personas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`mensaje_id\` int NOT NULL, \`usuario_id\` varchar(255) NOT NULL, \`leido\` tinyint NOT NULL DEFAULT 0, \`fecha_leido\` datetime NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`personas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`usuario_id\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_7ff5b074c2a48e81e2b995dd2a\` (\`usuario_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP COLUMN \`emisor_id\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP COLUMN \`fecha_envio\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD \`emisor_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD \`fecha_envio\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD \`emisorId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD \`destinatarioId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD \`leido\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD \`fechaLeido\` datetime NULL`);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD \`fechaEnvio\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD CONSTRAINT \`FK_4b0fede3b11197cd002c7c25764\` FOREIGN KEY (\`emisor_id\`) REFERENCES \`personas\`(\`usuario_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`destinatario_personas\` ADD CONSTRAINT \`FK_1d8d6389fa9ad5f33af51f8fe28\` FOREIGN KEY (\`mensaje_id\`) REFERENCES \`mensajes\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`destinatario_personas\` ADD CONSTRAINT \`FK_caf60c899fa1b43b66e18c54358\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`personas\`(\`usuario_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`destinatario_personas\` DROP FOREIGN KEY \`FK_caf60c899fa1b43b66e18c54358\``);
        await queryRunner.query(`ALTER TABLE \`destinatario_personas\` DROP FOREIGN KEY \`FK_1d8d6389fa9ad5f33af51f8fe28\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP FOREIGN KEY \`FK_4b0fede3b11197cd002c7c25764\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP COLUMN \`fechaEnvio\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP COLUMN \`fechaLeido\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP COLUMN \`leido\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP COLUMN \`destinatarioId\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP COLUMN \`emisorId\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP COLUMN \`fecha_envio\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` DROP COLUMN \`emisor_id\``);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD \`fecha_envio\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`mensajes\` ADD \`emisor_id\` varchar(255) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_7ff5b074c2a48e81e2b995dd2a\` ON \`personas\``);
        await queryRunner.query(`DROP TABLE \`personas\``);
        await queryRunner.query(`DROP TABLE \`destinatario_personas\``);
        await queryRunner.query(`DROP TABLE \`mensajes\``);
    }

}
