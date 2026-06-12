import { polls } from "./polls";
import { text, boolean, uuid, pgTable } from "drizzle-orm/pg-core";

export const questions = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  pollId: uuid("poll_id")
    .references(() => polls.id, { onDelete: "cascade" })
    .notNull(),
  text: text("text").notNull(),
  isMandatory: boolean("is_mandatory").default(true).notNull(),
  options: text("options").array().notNull(),
});
