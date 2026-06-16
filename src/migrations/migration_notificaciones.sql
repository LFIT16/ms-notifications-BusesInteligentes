-- ============================================================
-- Migración: Tabla notificaciones para ms-notifications
-- ============================================================

CREATE TABLE IF NOT EXISTS `notificaciones` (
  `id`             INT          NOT NULL AUTO_INCREMENT,
  `usuario_id`     VARCHAR(255) NOT NULL,
  `tipo`           ENUM(
                     'bienvenida_grupo',
                     'salida_grupo',
                     'remocion_grupo'
                   ) NOT NULL,
  `titulo`         VARCHAR(255) NOT NULL,
  `mensaje`        TEXT         NOT NULL,
  `leido`          TINYINT(1)   NOT NULL DEFAULT 0,
  `referencia_id`  INT          NULL,
  `fecha_creacion` DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  INDEX `idx_notif_usuario` (`usuario_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
