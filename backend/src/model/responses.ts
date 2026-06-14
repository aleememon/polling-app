import { uuid } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";
import { polls } from "./polls";
import { timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { questions } from "./questions";

export const responses = pgTable("responses", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  pollId: uuid("poll_id")
    .references(() => polls.id, { onDelete: "cascade" })
    .notNull(),
  creatorId: uuid("creator_id").references(() => users.id, { onDelete: "cascade"}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
