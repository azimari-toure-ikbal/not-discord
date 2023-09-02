DROP INDEX `profileIdx` ON `channel`;--> statement-breakpoint
DROP INDEX `serverIdx` ON `channel`;--> statement-breakpoint
DROP INDEX `profileIdx` ON `member`;--> statement-breakpoint
DROP INDEX `serverIdx` ON `member`;--> statement-breakpoint
DROP INDEX `profileIdx` ON `server`;--> statement-breakpoint
ALTER TABLE `profile` MODIFY COLUMN `id` varchar(40) NOT NULL DEFAULT '9e996029-ad52-4285-8aec-506b54df95fc';--> statement-breakpoint
CREATE INDEX `channel_profile_idx` ON `channel` (`id`);--> statement-breakpoint
CREATE INDEX `channel_server_idx` ON `channel` (`id`);--> statement-breakpoint
CREATE INDEX `memver_profile_idx` ON `member` (`id`);--> statement-breakpoint
CREATE INDEX `member_server_idx` ON `member` (`id`);--> statement-breakpoint
CREATE INDEX `server_profile_idx` ON `server` (`id`);