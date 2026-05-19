/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS `licit_system`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_0900_ai_ci;

USE `licit_system`;


-- Tabela: usuarios
-- (sem dependências externas — criada primeiro)
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id`           int          NOT NULL AUTO_INCREMENT,
  `nome`         varchar(100) NOT NULL,
  `email`        varchar(150) NOT NULL,
  `senha`        varchar(255) NOT NULL,
  `criado_em`    datetime     DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` datetime    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `ultimo_login` datetime     DEFAULT NULL,
  `perfil`       enum('admin','gestor','fornecedor','visualizacao') DEFAULT 'fornecedor',
  `ativo`        tinyint(1)   NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_usuario_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha`, `perfil`, `ativo`) VALUES
  (1, 'Usuário Sistema', 'sistema@licitsystem.local', 'sem-autenticacao-local', 'admin', 1)
ON DUPLICATE KEY UPDATE
  `nome` = VALUES(`nome`),
  `email` = VALUES(`email`),
  `perfil` = VALUES(`perfil`),
  `ativo` = VALUES(`ativo`);

-- Tabela: secretarias
-- (sem dependências externas)
DROP TABLE IF EXISTS `secretarias`;
CREATE TABLE `secretarias` (
  `id`    int          NOT NULL AUTO_INCREMENT,
  `sigla` varchar(10)  NOT NULL,
  `nome`  varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sigla` (`sigla`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `secretarias` (`sigla`, `nome`) VALUES
  ('SEAD',   'Secretaria Municipal de Administracao'),
  ('GAB',    'Gabinete'),
  ('SEGOV',  'Secretaria Municipal de Governo'),
  ('SMADS',  'Secretaria Municipal de Assistencia e Desenvolvimento Social'),
  ('SECULT', 'Secretaria Municipal de Cultura'),
  ('SMDET',  'Secretaria Municipal de Desenvolvimento Economico e Turismo'),
  ('SAJ',    'Secretaria Municipal de Assuntos Juridicos'),
  ('SMDUR',  'Secretaria Municipal de Desenvolvimento Urbano e Rural'),
  ('SEDU',   'Secretaria Municipal de Educacao'),
  ('SEMELJ', 'Secretaria Municipal de Esporte, Lazer e Juventude'),
  ('SEFIN',  'Secretaria Municipal de Financas'),
  ('SEMMA',  'Secretaria Municipal de Meio Ambiente'),
  ('SMOSP',  'Secretaria Municipal de Obras e Servicos Publicos'),
  ('SEMUS',  'Secretaria Municipal de Saude'),
  ('SMSP',   'Secretaria Municipal de Seguranca Publica'),
  ('SMPD',   'Secretaria Municipal da Pessoa com Deficiencia'),
  ('SMPP',   'Secretaria Municipal de Politicas Publicas'),
  ('SMDH',   'Secretaria Municipal da Mulher e de Direitos Humanos'),
  ('SEFAZ',  'Secretaria Municipal da Fazenda');


-- Tabela: categorias
-- (sem dependências externas)
DROP TABLE IF EXISTS `categorias`;
CREATE TABLE `categorias` (
  `id`   int         NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `tipo` enum('Global','Item','Lote') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `categorias` (`id`, `nome`, `tipo`) VALUES
  (1, 'Global', 'Global'),
  (2, 'Por Item', 'Item'),
  (3, 'Por Lote', 'Lote')
ON DUPLICATE KEY UPDATE
  `nome` = VALUES(`nome`),
  `tipo` = VALUES(`tipo`);

-- Tabela: licitacoes
-- (depende de: usuarios, secretarias, categorias)
DROP TABLE IF EXISTS `licitacoes`;
CREATE TABLE `licitacoes` (
  `id`               int            NOT NULL AUTO_INCREMENT,
  `usuario_id`       int            NOT NULL,
  `secretaria_id`    int            NOT NULL,
  `categoria_id`     int            NOT NULL,
  `numero`           int            NOT NULL,
  `ano`              int            NOT NULL,
  `tipo`             enum('Chamada Pública','Concorrência Pública', 'Concorrência Presencial','Credenciamento', 'Dispensa Eletrônica', 'Inexigibilidade', 'Pregão Eletrônico','Pregão Presencial') NOT NULL,
  `status`           enum('Aguardando Abertura','Aberto','Em Andamento','Suspenso','Revogado','Finalizado') DEFAULT 'Aguardando Abertura',
  `classificacao`    enum('Global','Item','Lote') DEFAULT 'Global',
  `objeto`           varchar(300)   DEFAULT NULL,
  `descricao_objeto` text,
  `valor_estimado`   decimal(15,2)  DEFAULT NULL,
  `data_publicacao`  date           DEFAULT NULL,
  `data_abertura`    date           DEFAULT NULL,
  `criado_em`        datetime       DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em`    datetime       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_numero_ano` (`numero`,`ano`),
  KEY `usuario_id`    (`usuario_id`),
  KEY `secretaria_id` (`secretaria_id`),
  KEY `categoria_id`  (`categoria_id`),
  CONSTRAINT `licitacoes_ibfk_1` FOREIGN KEY (`usuario_id`)    REFERENCES `usuarios`   (`id`),
  CONSTRAINT `licitacoes_ibfk_2` FOREIGN KEY (`secretaria_id`) REFERENCES `secretarias` (`id`),
  CONSTRAINT `licitacoes_ibfk_3` FOREIGN KEY (`categoria_id`)  REFERENCES `categorias`  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabela: licitacao_logs
-- (depende de: licitacoes, usuarios)
DROP TABLE IF EXISTS `licitacao_logs`;
CREATE TABLE `licitacao_logs` (
  `id`           int         NOT NULL AUTO_INCREMENT,
  `licitacao_id` int         NOT NULL,
  `usuario_id`   int         NOT NULL,
  `acao`         varchar(50) NOT NULL,
  `detalhes`     text,
  `criado_em`    datetime    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `licitacao_id` (`licitacao_id`),
  KEY `usuario_id`   (`usuario_id`),
  CONSTRAINT `licitacao_logs_ibfk_1` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`),
  CONSTRAINT `licitacao_logs_ibfk_2` FOREIGN KEY (`usuario_id`)   REFERENCES `usuarios`   (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabela: anexos
-- (depende de: licitacoes)
DROP TABLE IF EXISTS `anexos`;
CREATE TABLE `anexos` (
  `id`           int          NOT NULL AUTO_INCREMENT,
  `licitacao_id` int          NOT NULL,
  `nome`         varchar(200) NOT NULL,
  `caminho`      varchar(500) NOT NULL,
  `tipo`         varchar(10)  DEFAULT NULL,
  `categoria`    varchar(30)  NOT NULL DEFAULT 'documento',
  `tamanho_kb`   int          DEFAULT NULL,
  `criado_em`    datetime     DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `licitacao_id` (`licitacao_id`),
  CONSTRAINT `anexos_ibfk_1` FOREIGN KEY (`licitacao_id`) REFERENCES `licitacoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Tabela: convites
-- (depende de: usuarios)
DROP TABLE IF EXISTS `convites`;
CREATE TABLE `convites` (
  `id`             int          NOT NULL AUTO_INCREMENT,
  `usuario_id`     int          NOT NULL,
  `token`          varchar(100) NOT NULL,
  `usuario_acesso` varchar(100) NOT NULL,
  `senha_acesso`   varchar(255) NOT NULL,
  `perfil_acesso`  enum('admin','gestor','fornecedor','visualizacao') DEFAULT 'visualizacao',
  `validade_dias`  int          DEFAULT '7',
  `usado`          tinyint(1)   DEFAULT '0',
  `criado_em`      datetime     DEFAULT CURRENT_TIMESTAMP,
  `expira_em`      datetime     DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `convites_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Restauração das configurações originais
-- ============================================================
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Fim do script licit_system_completo.sql
