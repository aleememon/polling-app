import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).unique().notNull(),
    password: text("password").notNull(),
    salt: text("salt").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});