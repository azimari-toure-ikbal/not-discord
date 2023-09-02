CREATE TABLE `channel` (
	`id` varchar(40),
	`name` varchar(144) NOT NULL,
	`type` enum('TEXT','AUDIO','VIDEO') DEFAULT 'TEXT',
	`createdAt` datetime DEFAULT now(),
	`updatedAt` datetime,
	CONSTRAINT `channel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` varchar(40),
	`role` enum('ADMIN','MODERATOR','GUEST') DEFAULT 'GUEST',
	`createdAt` datetime DEFAULT now(),
	`updatedAt` datetime,
	CONSTRAINT `member_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` varchar(40) NOT NULL DEFAULT '5721b208-70fd-4e08-8ed2-076af2fc3744',
	`userId` varchar(40) NOT NULL,
	`name` varchar(144) NOT NULL,
	`imageUrl` text,
	`email` text,
	`createdAt` datetime DEFAULT now(),
	`updatedAt` datetime,
	CONSTRAINT `profile_id` PRIMARY KEY(`id`),
	CONSTRAINT `profile_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `server` (
	`id` varchar(40),
	`name` varchar(144) NOT NULL,
	`imageUrl` text,
	`inviteCode` text,
	`createdAt` datetime DEFAULT now(),
	`updatedAt` datetime,
	CONSTRAINT `server_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `profileIdx` ON `channel` (`id`);--> statement-breakpoint
CREATE INDEX `serverIdx` ON `channel` (`id`);--> statement-breakpoint
CREATE INDEX `profileIdx` ON `member` (`id`);--> statement-breakpoint
CREATE INDEX `serverIdx` ON `member` (`id`);--> statement-breakpoint
CREATE INDEX `profileIdx` ON `server` (`id`);