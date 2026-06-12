import { pgTable, uuid, text } from "drizzle-orm/pg-core";
import { questions } from "./questions";
import { responses } from "./responses";

export const answers = pgTable("answers", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  questionId: uuid("question_id")
    .references(() => questions.id, { onDelete: "cascade" })
    .notNull(),
  responseId: uuid("response_id")
    .references(() => responses.id, { onDelete: "cascade" })
    .notNull(),
  chosenOption: text("chosen_option").notNull(),
});
