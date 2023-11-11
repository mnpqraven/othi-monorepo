CREATE TABLE `honkai_avatarTrace` (
	`avatar_id` integer,
	`point_id` integer,
	PRIMARY KEY(`avatar_id`, `point_id`),
	FOREIGN KEY (`avatar_id`) REFERENCES `honkai_avatar`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`point_id`) REFERENCES `honkai_trace`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `honkai_avatar` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`rarity` integer NOT NULL,
	`votag` text,
	`damage_type` text,
	`path` text,
	`spneed` integer,
	FOREIGN KEY (`damage_type`) REFERENCES `honkai_element`(`name`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`path`) REFERENCES `honkai_path`(`name`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `honkai_avatarEidolon` (
	`avatar_id` integer,
	`eidolon_id` integer PRIMARY KEY,
	FOREIGN KEY (`avatar_id`) REFERENCES `honkai_avatar`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`eidolon_id`) REFERENCES `honkai_eidolon`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `honkai_eidolon` (
	`id` integer PRIMARY KEY NOT NULL,
	`rank` integer,
	`name` text,
	`desc` text,
	`unlock_cost` text,
	`param` text
);
--> statement-breakpoint
CREATE TABLE `honkai_avatarPromotion` (
	`id` integer PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `honkai_signature` (
	`avatar_id` integer,
	`lightcone_id` integer,
	PRIMARY KEY(`avatar_id`, `lightcone_id`),
	FOREIGN KEY (`avatar_id`) REFERENCES `honkai_avatar`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`lightcone_id`) REFERENCES `honkai_lightCone`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `honkai_avatarSkill` (
	`avatar_id` integer NOT NULL,
	`skill_id` integer NOT NULL,
	FOREIGN KEY (`avatar_id`) REFERENCES `honkai_avatar`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`skill_id`) REFERENCES `honkai_skill`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `honkai_skill` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`tag` text,
	`type_desc` text,
	`max_level` integer,
	`spbase` integer,
	`spneed` integer,
	`attack_type` text,
	`skill_desc` text,
	`param_list` text,
	FOREIGN KEY (`attack_type`) REFERENCES `honkai_skillType`(`name`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `blogs` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`content` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `honkai_element` (
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
CREATE TABLE `honkai_itemRarity` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `honkai_itemSubType` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `honkai_itemType` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `honkai_item` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`rarity` text,
	`main_type` text,
	`sub_type` text,
	`inventory_display_tag` integer,
	`purpose_type` integer,
	`desc` text,
	`bgdesc` text,
	`pile_limit` integer,
	FOREIGN KEY (`rarity`) REFERENCES `honkai_itemRarity`(`name`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`main_type`) REFERENCES `honkai_itemType`(`name`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`sub_type`) REFERENCES `honkai_itemSubType`(`name`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `honkai_path` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `honkai_lightCone` (
	`id` integer PRIMARY KEY NOT NULL,
	`release` integer,
	`name` text,
	`rarity` integer,
	`path` text,
	`max_promotion` integer,
	`max_rank` integer,
	`skill_id` integer,
	FOREIGN KEY (`path`) REFERENCES `honkai_path`(`name`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`skill_id`) REFERENCES `honkai_lightConeSkill`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `honkai_lightConeSkill` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`desc` text,
	`param_list` text,
	`ability_property` text
);
--> statement-breakpoint
CREATE TABLE `honkai_skillType` (
	`name` text PRIMARY KEY NOT NULL,
	`type` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `honkai_traceMaterial` (
	`request_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`item_id` integer,
	`point_id` integer,
	`level` integer,
	`item_num` integer,
	FOREIGN KEY (`item_id`) REFERENCES `honkai_item`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`point_id`) REFERENCES `honkai_trace`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `honkai_trace` (
	`id` integer PRIMARY KEY NOT NULL,
	`max_level` integer,
	`point_type` integer,
	`anchor` text,
	`default_unlock` integer,
	`avatar_promotion_limit` integer,
	`pre_point` text,
	`point_desc` text,
	`param_list` text
);
--> statement-breakpoint
CREATE TABLE `honkai_property` (
	`type` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`skill_tree_desc` text,
	`relic_desc` text,
	`filter_desc` text,
	`main_relic_filter` integer,
	`sub_relic_filter` integer,
	`property_classify` integer,
	`is_display` integer,
	`is_battle_display` integer,
	`order` integer
);
--> statement-breakpoint
CREATE INDEX `idx_eidolon_avatar_id` ON `honkai_avatarEidolon` (`avatar_id`);--> statement-breakpoint
CREATE INDEX `idx_signature_avatar_id` ON `honkai_signature` (`avatar_id`);--> statement-breakpoint
CREATE INDEX `idx_avatarSkill_avatar_id` ON `honkai_avatarSkill` (`avatar_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_avatarSkill_skill_id` ON `honkai_avatarSkill` (`skill_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_frameworks_name` ON `frameworks` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_frameworks_url` ON `frameworks` (`url`);