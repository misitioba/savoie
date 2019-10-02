-- Adminer 4.7.1 MySQL dump

SET NAMES utf8;
SET time_zone
= '+00:00';

USE `__DATABASE_NAME__`;

DROP TABLE IF EXISTS `contact_messages`;
CREATE TABLE `contact_messages`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `name` varchar
(255) DEFAULT NULL,
  `email` varchar
(255) NOT NULL,
  `phone` varchar
(255) DEFAULT NULL,
  `message` text NOT NULL,
  `creation_date` bigint
(20) NOT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `modules`;
CREATE TABLE `modules`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `title` varchar
(255) NOT NULL,
  `enabled` tinyint
(4) NOT NULL DEFAULT 0,
  `api_key` varchar
(255) DEFAULT NULL,
  `db_name` varchar
(255) DEFAULT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `email` varchar
(255) NOT NULL,
  `password` varchar
(255) NOT NULL,
  `creation_date` bigint
(20) DEFAULT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE `feedbacks`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `module_id` int
(11) NOT NULL,
  `user_id` int
(11) NOT NULL,
  `title` varchar
(255) NOT NULL,
  `message` text NOT NULL,
  `file_id` int
(11) DEFAULT NULL,
  `creation_date` bigint
(20) NOT NULL,
  PRIMARY KEY
(`id`),
  KEY `user_id`
(`user_id`),
  KEY `module_id`
(`module_id`),
  KEY `file_id`
(`file_id`),
  CONSTRAINT `feedbacks_ibfk_5` FOREIGN KEY
(`user_id`) REFERENCES `users`
(`id`) ON
DELETE CASCADE,
  CONSTRAINT `feedbacks_ibfk_6` FOREIGN KEY
(`module_id`) REFERENCES `modules`
(`id`) ON
DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `owner` int
(11) NOT NULL,
  `description` text NOT NULL,
  `title` varchar
(500) NOT NULL,
  PRIMARY KEY
(`id`),
  KEY `owner`
(`owner`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY
(`owner`) REFERENCES `users`
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



DROP TABLE IF EXISTS `feedbak_tasks`;
CREATE TABLE `feedbak_tasks`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `feedback_id` int
(11) NOT NULL,
  `task_id` int
(11) NOT NULL,
  PRIMARY KEY
(`id`),
  KEY `feedback_id`
(`feedback_id`),
  KEY `task_id`
(`task_id`),
  CONSTRAINT `feedbak_tasks_ibfk_1` FOREIGN KEY
(`feedback_id`) REFERENCES `feedbacks`
(`id`),
  CONSTRAINT `feedbak_tasks_ibfk_2` FOREIGN KEY
(`task_id`) REFERENCES `tasks`
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `files`;
CREATE TABLE `files`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `file_type` varchar
(255) NOT NULL,
  `file_size` bigint
(20) NOT NULL,
  `file` mediumblob NOT NULL,
  `updated_at` bigint
(20) NOT NULL,
  `feedback_id` int
(11) DEFAULT NULL,
  PRIMARY KEY
(`id`),
  KEY `feedback_id`
(`feedback_id`),
  CONSTRAINT `files_ibfk_2` FOREIGN KEY
(`feedback_id`) REFERENCES `feedbacks`
(`id`) ON
DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=latin1;



SET NAMES utf8mb4;

DROP TABLE IF EXISTS `murmurs`;
CREATE TABLE `murmurs`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `hash` varchar
(255) NOT NULL,
  `components` longtext CHARACTER
SET utf8mb4
COLLATE utf8mb4_bin DEFAULT NULL,
  `last_visit` bigint
(20) DEFAULT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `hash`
(`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `murmur_events`;
CREATE TABLE `murmur_events`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `hash` varchar
(255) NOT NULL,
  `name` varchar
(255) NOT NULL,
  `data` longtext DEFAULT NULL,
  `creation_date` bigint
(20) NOT NULL,
  PRIMARY KEY
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`
(
  `id` int
(11) NOT NULL,
  `code` varchar
(255) NOT NULL,
  `description` varchar
(255) DEFAULT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `code`
(`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions`
(
  `session_id` varchar
(128) CHARACTER
SET utf8mb4
COLLATE utf8mb4_bin NOT NULL,
  `expires` int
(11) unsigned NOT NULL,
  `data` text CHARACTER
SET utf8mb4
COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY
(`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;





DROP TABLE IF EXISTS `user_modules`;
CREATE TABLE `user_modules`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `user_id` int
(11) NOT NULL,
  `module_id` int
(11) NOT NULL,
  `role_id` int
(11) NOT NULL,
  `dbname` varchar
(255) NOT NULL,
  PRIMARY KEY
(`id`),
  UNIQUE KEY `user_id_module_id`
(`user_id`,`module_id`),
  KEY `module_id`
(`module_id`),
  KEY `role`
(`role_id`),
  CONSTRAINT `user_modules_ibfk_1` FOREIGN KEY
(`user_id`) REFERENCES `users`
(`id`) ON
DELETE CASCADE,
  CONSTRAINT `user_modules_ibfk_2` FOREIGN KEY
(`module_id`) REFERENCES `modules`
(`id`) ON
DELETE CASCADE,
  CONSTRAINT `user_modules_ibfk_3` FOREIGN KEY
(`role_id`) REFERENCES `roles`
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `user_notifications`;
CREATE TABLE `user_notifications`
(
  `id` int
(11) NOT NULL AUTO_INCREMENT,
  `user` int
(11) NOT NULL,
  `message` text NOT NULL,
  `created` bigint
(20) NOT NULL,
  `flag_readed` tinyint
(4) NOT NULL DEFAULT 0,
  PRIMARY KEY
(`id`),
  KEY `user`
(`user`),
  CONSTRAINT `user_notifications_ibfk_1` FOREIGN KEY
(`user`) REFERENCES `users`
(`id`) ON
DELETE CASCADE
) ENGINE=InnoDB
DEFAULT CHARSET=latin1;


-- 2019-09-12 10:00:35
