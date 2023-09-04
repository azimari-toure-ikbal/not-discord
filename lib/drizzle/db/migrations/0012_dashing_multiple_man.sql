ALTER TABLE `server` DROP FOREIGN KEY `server_profileId_profile_id_fk`;
--> statement-breakpoint
DROP INDEX `channel_profile_idx` ON `directMessage`;--> statement-breakpoint
DROP INDEX `channel_profile_idx` ON `message`;--> statement-breakpoint
ALTER TABLE `directMessage` ADD `deleted` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `directMessage` DROP COLUMN `profileId`;--> statement-breakpoint
ALTER TABLE `message` DROP COLUMN `profileId`;