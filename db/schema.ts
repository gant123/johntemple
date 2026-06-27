import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// Quote requests submitted through the "smart form" on the home page.
// Stored as a durable record so John never loses a lead even if the
// SMS/email notification step fails.
export const quoteRequests = sqliteTable("quote_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull().default(""),
  // JSON-encoded array of selected service titles.
  services: text("services").notNull().default("[]"),
  preferredDay: text("preferred_day").notNull().default(""),
  message: text("message").notNull().default(""),
  // JSON-encoded array of absolute photo URLs stored in R2.
  photoUrls: text("photo_urls").notNull().default("[]"),
  // "sent" | "failed" | "skipped" — whether John's text went out.
  notifyStatus: text("notify_status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
