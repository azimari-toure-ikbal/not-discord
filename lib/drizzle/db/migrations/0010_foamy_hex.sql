CREATE TABLE `conversation` (
	`id` varchar(40) NOT NULL,
	`memberOneId` varchar(40),
	`memberTwoId` varchar(40),
	`createdAt` datetime DEFAULT now(),
	`updatedAt` datetime,
	CONSTRAINT `conversation_id` PRIMARY KEY(`id`),
	CONSTRAINT `conversation_memberOneId_unique` UNIQUE(`memberOneId`),
	CONSTRAINT `conversation_memberTwoId_unique` UNIQUE(`memberTwoId`)
);
--> statement-breakpoint
CREATE TABLE `directMessage` (
	`id` varchar(40) NOT NULL,
	`content` text,
	`fileUrl` text,
	`conversationId` varchar(40),
	`profileId` varchar(40),
	`memberId` varchar(40),
	`createdAt` datetime DEFAULT now(),
	`updatedAt` datetime,
	CONSTRAINT `directMessage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `message` (
	`id` varchar(40) NOT NULL,
	`content` text,
	`fileUrl` text,
	`profileId` varchar(40),
	`channelId` varchar(40),
	`serverId` varchar(40),
	`deleted` boolean DEFAULT false,
	`createdAt` datetime DEFAULT now(),
	`updatedAt` datetime,
	CONSTRAINT `message_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `conversation_memberOne_idx` ON `conversation` (`memberOneId`);--> statement-breakpoint
CREATE INDEX `conversation_memberTwo_idx` ON `conversation` (`memberTwoId`);--> statement-breakpoint
CREATE INDEX `channel_profile_idx` ON `directMessage` (`profileId`);--> statement-breakpoint
CREATE INDEX `channel_server_idx` ON `directMessage` (`memberId`);--> statement-breakpoint
CREATE INDEX `channel_profile_idx` ON `message` (`profileId`);--> statement-breakpoint
CREATE INDEX `channel_server_idx` ON `message` (`channelId`);