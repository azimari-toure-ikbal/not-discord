DROP INDEX `channel_profile_idx` ON `channel`;--> statement-breakpoint
DROP INDEX `channel_server_idx` ON `channel`;--> statement-breakpoint
DROP INDEX `memver_profile_idx` ON `member`;--> statement-breakpoint
DROP INDEX `member_server_idx` ON `member`;--> statement-breakpoint
DROP INDEX `server_profile_idx` ON `server`;--> statement-breakpoint
ALTER TABLE `channel` MODIFY COLUMN `id` varchar(40) NOT NULL;--> statement-breakpoint
ALTER TABLE `member` MODIFY COLUMN `id` varchar(40) NOT NULL;--> statement-breakpoint
ALTER TABLE `server` MODIFY COLUMN `id` varchar(40) NOT NULL;--> statement-breakpoint
ALTER TABLE `channel` ADD `profileId` varchar(40);--> statement-breakpoint
ALTER TABLE `channel` ADD `serverId` varchar(40);--> statement-breakpoint
ALTER TABLE `member` ADD `profileId` varchar(40);--> statement-breakpoint
ALTER TABLE `member` ADD `serverId` varchar(40);--> statement-breakpoint
ALTER TABLE `server` ADD `profileId` varchar(40);--> statement-breakpoint
CREATE INDEX `channel_profile_idx` ON `channel` (`profileId`);--> statement-breakpoint
CREATE INDEX `channel_server_idx` ON `channel` (`serverId`);--> statement-breakpoint
CREATE INDEX `memver_profile_idx` ON `member` (`profileId`);--> statement-breakpoint
CREATE INDEX `member_server_idx` ON `member` (`serverId`);--> statement-breakpoint
CREATE INDEX `server_profile_idx` ON `server` (`profileId`);