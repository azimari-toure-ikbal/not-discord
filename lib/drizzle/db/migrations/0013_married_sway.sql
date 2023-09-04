ALTER TABLE `directMessage` ADD `profileId` varchar(40);--> statement-breakpoint
ALTER TABLE `message` ADD `profileId` varchar(40);--> statement-breakpoint
CREATE INDEX `channel_profile_idx` ON `directMessage` (`profileId`);--> statement-breakpoint
CREATE INDEX `channel_profile_idx` ON `message` (`profileId`);