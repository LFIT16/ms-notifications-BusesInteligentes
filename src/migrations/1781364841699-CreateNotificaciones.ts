import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateNotificaciones1781364841699 implements MigrationInterface {
    name = 'CreateNotificaciones1781364841699'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notificaciones\` (\`id\` int NOT NULL AUTO_INCREMENT, \`usuario_id\` varchar(255) NOT NULL, \`tipo\` enum ('bienvenida_grupo', 'salida_grupo', 'remocion_grupo') NOT NULL, \`titulo\` varchar(255) NOT NULL, \`mensaje\` text NOT NULL, \`leido\` tinyint NOT NULL DEFAULT 0, \`referencia_id\` int NULL, \`fecha_creacion\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`notificaciones\``);
    }

}
