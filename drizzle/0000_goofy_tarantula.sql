CREATE TABLE `quote_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`address` text DEFAULT '' NOT NULL,
	`services` text DEFAULT '[]' NOT NULL,
	`preferred_day` text DEFAULT '' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`photo_urls` text DEFAULT '[]' NOT NULL,
	`notify_status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
