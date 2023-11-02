CREATE TABLE `avatar` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`rarity` integer NOT NULL,
	`votag` text,
	`damage_type` text NOT NULL,
	`path` text NOT NULL,
	`spneed` integer,
	FOREIGN KEY (`damage_type`) REFERENCES `element`(`name`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`path`) REFERENCES `path`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`content` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `element` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `frameworks` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(255) NOT NULL,
	`language` text NOT NULL,
	`url` text,
	`stars` integer
);
--> statement-breakpoint
CREATE TABLE `itemRarity` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `itemSubType` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `itemType` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `path` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_frameworks_name` ON `frameworks` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_frameworks_url` ON `frameworks` (`url`);