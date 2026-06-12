import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";
import { boolean } from "drizzle-orm/pg-core";

export const polls = pgTable("polls", {
    id: uuid("id").primaryKey().defaultRandom(),
    creatorId: uuid("creator_id").references(() => users.id).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    isAnonymous: boolean("is_anonymous").default(true).notNull(), 
    slug: text("slug").notNull().unique(),
    expiresAt: timestamp("expires_at").notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});